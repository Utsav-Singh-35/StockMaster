import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { getISTDate } from '../lib/timezone';

const router = Router();
router.use(authenticate);

// Get all deliveries
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const where: any = {};
    
    if (status && status !== 'All') {
      where.status = status;
    }

    const deliveries = await prisma.delivery.findMany({
      where,
      include: {
        warehouse: true,
        lines: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: deliveries.map(d => ({
        id: d.deliveryNumber,
        customer: d.customerName,
        products: d.lines.map(l => ({
          name: l.product.name,
          quantity: Number(l.quantity),
          unit: l.unit
        })),
        status: d.status,
        date: d.deliveryDate.toISOString().split('T')[0],
        warehouse: d.warehouse.name,
        warehouseId: d.warehouseId
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Create delivery
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { customerName, warehouseId, deliveryDate, products } = req.body;

    // Generate delivery number
    const count = await prisma.delivery.count();
    const deliveryNumber = `D-${(count + 210).toString()}`;

    const delivery = await prisma.delivery.create({
      data: {
        deliveryNumber,
        customerName,
        warehouseId,
        deliveryDate: new Date(deliveryDate),
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
      data: delivery,
      message: 'Delivery created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: error.message }
    });
  }
});

// Update delivery status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const delivery = await prisma.delivery.findFirst({
      where: { deliveryNumber: req.params.id }
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Delivery not found' }
      });
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id: delivery.id },
      data: { status },
      include: {
        lines: { include: { product: true } },
        warehouse: true
      }
    });

    res.json({
      success: true,
      data: updatedDelivery,
      message: 'Delivery status updated'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: error.message }
    });
  }
});

// Ship delivery (decreases stock)
router.post('/:id/ship', async (req, res) => {
  try {
    const delivery = await prisma.delivery.findFirst({
      where: { deliveryNumber: req.params.id },
      include: { lines: true }
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Delivery not found' }
      });
    }

    if (delivery.status === 'SHIPPED') {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_SHIPPED', message: 'Delivery already shipped' }
      });
    }

    // Check stock availability and update
    for (const line of delivery.lines) {
      const stock = await prisma.stock.findUnique({
        where: {
          productId_warehouseId: {
            productId: line.productId,
            warehouseId: delivery.warehouseId
          }
        }
      });

      if (!stock || Number(stock.quantity) < Number(line.quantity)) {
        return res.status(400).json({
          success: false,
          error: { code: 'INSUFFICIENT_STOCK', message: 'Insufficient stock for delivery' }
        });
      }

      const quantityBefore = Number(stock.quantity);
      const quantityChange = -Number(line.quantity);
      const quantityAfter = quantityBefore + quantityChange;

      // Update stock
      await prisma.stock.update({
        where: { id: stock.id },
        data: {
          quantity: quantityAfter,
          lastUpdated: getISTDate()
        }
      });

      // Create stock movement
      await prisma.stockMovement.create({
        data: {
          productId: line.productId,
          warehouseId: delivery.warehouseId,
          movementType: 'DELIVERY',
          referenceId: delivery.id,
          referenceNumber: delivery.deliveryNumber,
          quantityChange,
          quantityBefore,
          quantityAfter
        }
      });
    }

    // Update delivery status
    const updatedDelivery = await prisma.delivery.update({
      where: { id: delivery.id },
      data: {
        status: 'SHIPPED',
        shippedAt: getISTDate()
      },
      include: {
        lines: { include: { product: true } },
        warehouse: true
      }
    });

    res.json({
      success: true,
      data: updatedDelivery,
      message: 'Delivery shipped and stock updated'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SHIP_ERROR', message: error.message }
    });
  }
});

export default router;
