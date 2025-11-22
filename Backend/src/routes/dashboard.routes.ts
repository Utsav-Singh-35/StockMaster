import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Get KPIs
router.get('/kpis', async (req, res) => {
  try {
    // Total products
    const totalProducts = await prisma.product.count();

    // Get all products with their stock
    const productsWithStock = await prisma.product.findMany({
      include: {
        stock: true
      }
    });

    // Calculate low stock items
    let lowStockCount = 0;
    let outOfStockCount = 0;

    productsWithStock.forEach(product => {
      const totalStock = product.stock.reduce((sum, s) => sum + Number(s.quantity), 0);
      if (totalStock === 0) {
        outOfStockCount++;
        lowStockCount++;
      } else if (totalStock < product.reorderLevel) {
        lowStockCount++;
      }
    });

    // Pending receipts
    const pendingReceipts = await prisma.receipt.count({
      where: { status: { in: ['DRAFT', 'WAITING'] } }
    });

    // Pending deliveries
    const pendingDeliveries = await prisma.delivery.count({
      where: { status: { in: ['DRAFT', 'PICKING', 'PACKING', 'READY'] } }
    });

    // Internal transfers
    const internalTransfers = await prisma.transfer.count({
      where: { status: 'READY' }
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockItems: lowStockCount,
        outOfStockItems: outOfStockCount,
        pendingReceipts,
        pendingDeliveries,
        internalTransfers
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Get recent operations
router.get('/operations', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    const [receipts, deliveries, transfers, adjustments] = await Promise.all([
      prisma.receipt.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          warehouse: true,
          lines: { include: { product: true } }
        }
      }),
      prisma.delivery.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          warehouse: true,
          lines: { include: { product: true } }
        }
      }),
      prisma.transfer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          product: true,
          fromWarehouse: true,
          toWarehouse: true
        }
      }),
      prisma.adjustment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          product: true,
          warehouse: true
        }
      })
    ]);

    const operations = [
      ...receipts.map(r => ({
        id: r.receiptNumber,
        type: 'Receipt',
        products: r.lines.map(l => `${l.quantity} ${l.unit} ${l.product.name}`).join(', '),
        source: r.supplierName,
        destination: r.warehouse.name,
        status: r.status,
        date: r.expectedDate.toISOString().split('T')[0]
      })),
      ...deliveries.map(d => ({
        id: d.deliveryNumber,
        type: 'Delivery',
        products: d.lines.map(l => `${l.quantity} ${l.unit} ${l.product.name}`).join(', '),
        source: d.warehouse.name,
        destination: d.customerName,
        status: d.status,
        date: d.deliveryDate.toISOString().split('T')[0]
      })),
      ...transfers.map(t => ({
        id: t.transferNumber,
        type: 'Transfer',
        products: `${t.quantity} ${t.product.unit} ${t.product.name}`,
        source: t.fromWarehouse.name,
        destination: t.toWarehouse.name,
        status: t.status === 'DONE' ? 'Done' : 'Ready',
        date: t.transferDate.toISOString().split('T')[0]
      })),
      ...adjustments.map(a => ({
        id: a.adjustmentNumber,
        type: 'Adjustment',
        products: `${a.difference} ${a.product.unit} ${a.product.name}`,
        source: a.warehouse.name,
        destination: 'Adjustment',
        status: 'Done',
        date: a.adjustmentDate.toISOString().split('T')[0]
      }))
    ];

    operations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({
      success: true,
      data: operations.slice(0, limit)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

export default router;
