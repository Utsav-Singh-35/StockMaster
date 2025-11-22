import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

// Get all adjustments
router.get('/', async (req, res) => {
  try {
    const adjustments = await prisma.adjustment.findMany({
      include: {
        product: true,
        warehouse: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: adjustments.map(a => ({
        id: a.adjustmentNumber,
        product: a.product.name,
        recorded: Number(a.recordedQuantity),
        counted: Number(a.countedQuantity),
        difference: Number(a.difference),
        reason: a.reason,
        warehouse: a.warehouse.name,
        date: a.adjustmentDate.toISOString().split('T')[0]
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Create adjustment (immediately updates stock)
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { productId, warehouseId, countedQuantity, reason, adjustmentDate } = req.body;

    // Get current stock
    const stock = await prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId
        }
      }
    });

    const recordedQuantity = stock ? Number(stock.quantity) : 0;
    const difference = countedQuantity - recordedQuantity;

    // Generate adjustment number
    const count = await prisma.adjustment.count();
    const adjustmentNumber = `A-${(count + 45).toString()}`;

    // Create adjustment record
    const adjustment = await prisma.adjustment.create({
      data: {
        adjustmentNumber,
        productId,
        warehouseId,
        recordedQuantity,
        countedQuantity,
        difference,
        reason,
        adjustmentDate: new Date(adjustmentDate),
        createdBy: req.user!.userId
      },
      include: {
        product: true,
        warehouse: true
      }
    });

    // Update stock
    const quantityBefore = recordedQuantity;
    const quantityChange = difference;
    const quantityAfter = countedQuantity;

    await prisma.stock.upsert({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId
        }
      },
      update: {
        quantity: quantityAfter,
        lastUpdated: new Date()
      },
      create: {
        productId,
        warehouseId,
        quantity: quantityAfter,
        lastUpdated: new Date()
      }
    });

    // Create stock movement
    await prisma.stockMovement.create({
      data: {
        productId,
        warehouseId,
        movementType: 'ADJUSTMENT',
        referenceId: adjustment.id,
        referenceNumber: adjustment.adjustmentNumber,
        quantityChange,
        quantityBefore,
        quantityAfter
      }
    });

    res.status(201).json({
      success: true,
      data: adjustment,
      message: 'Adjustment created and stock updated'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: error.message }
    });
  }
});

export default router;
