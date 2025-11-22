import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

// Get all stock levels
router.get('/', async (req, res) => {
  try {
    const stock = await prisma.stock.findMany({
      include: {
        product: true,
        warehouse: true
      },
      orderBy: [
        { product: { name: 'asc' } },
        { warehouse: { name: 'asc' } }
      ]
    });

    res.json({
      success: true,
      data: stock.map(s => ({
        productId: s.productId,
        productName: s.product.name,
        productSku: s.product.sku,
        warehouseId: s.warehouseId,
        warehouseName: s.warehouse.name,
        quantity: Number(s.quantity),
        unit: s.product.unit,
        lastUpdated: s.lastUpdated
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Get low stock items
router.get('/low', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        stock: { include: { warehouse: true } }
      }
    });

    const lowStockProducts = products.filter(product => {
      const totalStock = product.stock.reduce((sum, s) => sum + Number(s.quantity), 0);
      return totalStock > 0 && totalStock < product.reorderLevel;
    }).map(product => {
      const totalStock = product.stock.reduce((sum, s) => sum + Number(s.quantity), 0);
      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        totalStock,
        reorderLevel: product.reorderLevel,
        status: 'Low Stock',
        locations: product.stock.map(s => ({
          warehouse: s.warehouse.name,
          quantity: Number(s.quantity)
        }))
      };
    });

    res.json({
      success: true,
      data: lowStockProducts
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Get stock movements (audit trail)
router.get('/movements', async (req, res) => {
  try {
    const { productId, warehouseId, limit = '100' } = req.query;
    
    const where: any = {};
    if (productId) where.productId = productId;
    if (warehouseId) where.warehouseId = warehouseId;

    const movements = await prisma.stockMovement.findMany({
      where,
      include: {
        product: true,
        warehouse: true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: movements.map(m => ({
        id: m.id,
        product: m.product.name,
        warehouse: m.warehouse.name,
        type: m.movementType,
        referenceNumber: m.referenceNumber,
        quantityChange: Number(m.quantityChange),
        quantityBefore: Number(m.quantityBefore),
        quantityAfter: Number(m.quantityAfter),
        date: m.createdAt
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

export default router;
