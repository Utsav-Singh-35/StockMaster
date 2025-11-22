import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { Prisma } from '@prisma/client';

const router = Router();
router.use(authenticate);

// Get all receipts
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const where: any = {};
    
    if (status && status !== 'All') {
      where.status = status;
    }

    const receipts = await prisma.receipt.findMany({
      where,
      include: {
        warehouse: true,
        lines: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: receipts.map(r => ({
        id: r.receiptNumber,
        supplier: r.supplierName,
        products: r.lines.map(l => ({
          name: l.product.name,
          quantity: Number(l.quantity),
          unit: l.unit
        })),
        status: r.status,
        date: r.expectedDate.toISOString().split('T')[0],
        warehouse: r.warehouse.name,
        warehouseId: r.warehouseId
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Get single receipt
router.get('/:id', async (req, res) => {
  try {
    const receipt = await prisma.receipt.findFirst({
      where: { receiptNumber: req.params.id },
      include: {
        warehouse: true,
        lines: { include: { product: true } }
      }
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Receipt not found' }
      });
    }

    res.json({
      success: true,
      data: receipt
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Create receipt
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { supplierName, warehouseId, expectedDate, products } = req.body;

    // Generate receipt number
    const count = await prisma.receipt.count();
    const receiptNumber = `R-${(count + 120).toString()}`;

    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber,
        supplierName,
        warehouseId,
        expectedDate: new Date(expectedDate),
        status: 'DRAFT',
        createdBy: req.user!.userId,
        lines: {
          create: products.map((p: any) => ({
            productId: p.productId,
            quantity: p.quantity,
            unit: p.unit
          }))
        }
      },
      include: {
        lines: { include: { product: true } },
        warehouse: true
      }
    });

    res.status(201).json({
      success: true,
      data: receipt,
      message: 'Receipt created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: error.message }
    });
  }
});

// Validate receipt (increases stock)
router.post('/:id/validate', async (req: AuthRequest, res) => {
  try {
    const receipt = await prisma.receipt.findFirst({
      where: { receiptNumber: req.params.id },
      include: { lines: true }
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Receipt not found' }
      });
    }

    if (receipt.status === 'VALIDATED') {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_VALIDATED', message: 'Receipt already validated' }
      });
    }

    // Update stock for each line
    for (const line of receipt.lines) {
      // Get or create stock record
      const existingStock = await prisma.stock.findUnique({
        where: {
          productId_warehouseId: {
            productId: line.productId,
            warehouseId: receipt.warehouseId
          }
        }
      });

      const quantityBefore = existingStock ? Number(existingStock.quantity) : 0;
      const quantityChange = Number(line.quantity);
      const quantityAfter = quantityBefore + quantityChange;

      // Upsert stock
      await prisma.stock.upsert({
        where: {
          productId_warehouseId: {
            productId: line.productId,
            warehouseId: receipt.warehouseId
          }
        },
        update: {
          quantity: quantityAfter,
          lastUpdated: new Date()
        },
        create: {
          productId: line.productId,
          warehouseId: receipt.warehouseId,
          quantity: quantityAfter,
          lastUpdated: new Date()
        }
      });

      // Create stock movement record
      await prisma.stockMovement.create({
        data: {
          productId: line.productId,
          warehouseId: receipt.warehouseId,
          movementType: 'RECEIPT',
          referenceId: receipt.id,
          referenceNumber: receipt.receiptNumber,
          quantityChange,
          quantityBefore,
          quantityAfter
        }
      });
    }

    // Update receipt status
    const updatedReceipt = await prisma.receipt.update({
      where: { id: receipt.id },
      data: {
        status: 'VALIDATED',
        validatedAt: new Date(),
        validatedBy: req.user!.userId
      },
      include: {
        lines: { include: { product: true } },
        warehouse: true
      }
    });

    res.json({
      success: true,
      data: updatedReceipt,
      message: 'Receipt validated and stock updated'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: error.message }
    });
  }
});

// Delete receipt
router.delete('/:id', async (req, res) => {
  try {
    const receipt = await prisma.receipt.findFirst({
      where: { receiptNumber: req.params.id }
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Receipt not found' }
      });
    }

    if (receipt.status === 'VALIDATED') {
      return res.status(400).json({
        success: false,
        error: { code: 'CANNOT_DELETE', message: 'Cannot delete validated receipt' }
      });
    }

    await prisma.receipt.delete({
      where: { id: receipt.id }
    });

    res.json({
      success: true,
      message: 'Receipt deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_ERROR', message: error.message }
    });
  }
});

export default router;
