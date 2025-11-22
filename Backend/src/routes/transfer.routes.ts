import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { getISTDate } from '../lib/timezone';

const router = Router();
router.use(authenticate);

// Get all transfers
router.get('/', async (req, res) => {
  try {
    const transfers = await prisma.transfer.findMany({
      include: {
        product: true,
        fromWarehouse: true,
        toWarehouse: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: transfers.map(t => ({
        id: t.transferNumber,
        product: t.product.name,
        quantity: Number(t.quantity),
        from: t.fromWarehouse.name,
        to: t.toWarehouse.name,
        status: t.status,
        date: t.transferDate.toISOString().split('T')[0]
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Create transfer
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { productId, fromWarehouseId, toWarehouseId, quantity, transferDate } = req.body;

    if (fromWarehouseId === toWarehouseId) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TRANSFER', message: 'Source and destination must be different' }
      });
    }

    // Check stock availability
    const stock = await prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId: fromWarehouseId
        }
      }
    });

    if (!stock || Number(stock.quantity) < quantity) {
      return res.status(400).json({
        success: false,
        error: { code: 'INSUFFICIENT_STOCK', message: 'Insufficient stock for transfer' }
      });
    }

    // Generate transfer number
    const count = await prisma.transfer.count();
    const transferNumber = `T-${(count + 90).toString()}`;

    const transfer = await prisma.transfer.create({
      data: {
        transferNumber,
        productId,
        fromWarehouseId,
        toWarehouseId,
        quantity,
        transferDate: new Date(transferDate),
        status: 'READY',
        createdBy: req.user!.userId
      },
      include: {
        product: true,
        fromWarehouse: true,
        toWarehouse: true
      }
    });

    res.status(201).json({
      success: true,
      data: transfer,
      message: 'Transfer created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: error.message }
    });
  }
});

// Complete transfer
router.post('/:id/complete', async (req, res) => {
  try {
    const transfer = await prisma.transfer.findFirst({
      where: { transferNumber: req.params.id }
    });

    if (!transfer) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Transfer not found' }
      });
    }

    if (transfer.status === 'DONE') {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_COMPLETED', message: 'Transfer already completed' }
      });
    }

    // Decrease stock from source warehouse
    const fromStock = await prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId: transfer.productId,
          warehouseId: transfer.fromWarehouseId
        }
      }
    });

    if (!fromStock || Number(fromStock.quantity) < Number(transfer.quantity)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INSUFFICIENT_STOCK', message: 'Insufficient stock in source warehouse' }
      });
    }

    const fromQuantityBefore = Number(fromStock.quantity);
    const fromQuantityChange = -Number(transfer.quantity);
    const fromQuantityAfter = fromQuantityBefore + fromQuantityChange;

    await prisma.stock.update({
      where: { id: fromStock.id },
      data: {
        quantity: fromQuantityAfter,
        lastUpdated: getISTDate()
      }
    });

    // Create movement for source
    await prisma.stockMovement.create({
      data: {
        productId: transfer.productId,
        warehouseId: transfer.fromWarehouseId,
        movementType: 'TRANSFER_OUT',
        referenceId: transfer.id,
        referenceNumber: transfer.transferNumber,
        quantityChange: fromQuantityChange,
        quantityBefore: fromQuantityBefore,
        quantityAfter: fromQuantityAfter
      }
    });

    // Increase stock in destination warehouse
    const toStock = await prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId: transfer.productId,
          warehouseId: transfer.toWarehouseId
        }
      }
    });

    const toQuantityBefore = toStock ? Number(toStock.quantity) : 0;
    const toQuantityChange = Number(transfer.quantity);
    const toQuantityAfter = toQuantityBefore + toQuantityChange;

    await prisma.stock.upsert({
      where: {
        productId_warehouseId: {
          productId: transfer.productId,
          warehouseId: transfer.toWarehouseId
        }
      },
      update: {
        quantity: toQuantityAfter,
        lastUpdated: getISTDate()
      },
      create: {
        productId: transfer.productId,
        warehouseId: transfer.toWarehouseId,
        quantity: toQuantityAfter,
        lastUpdated: getISTDate()
      }
    });

    // Create movement for destination
    await prisma.stockMovement.create({
      data: {
        productId: transfer.productId,
        warehouseId: transfer.toWarehouseId,
        movementType: 'TRANSFER_IN',
        referenceId: transfer.id,
        referenceNumber: transfer.transferNumber,
        quantityChange: toQuantityChange,
        quantityBefore: toQuantityBefore,
        quantityAfter: toQuantityAfter
      }
    });

    // Update transfer status
    const updatedTransfer = await prisma.transfer.update({
      where: { id: transfer.id },
      data: {
        status: 'DONE',
        completedAt: getISTDate()
      },
      include: {
        product: true,
        fromWarehouse: true,
        toWarehouse: true
      }
    });

    res.json({
      success: true,
      data: updatedTransfer,
      message: 'Transfer completed and stock updated'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'COMPLETE_ERROR', message: error.message }
    });
  }
});

export default router;
