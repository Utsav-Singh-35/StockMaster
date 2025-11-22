import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

// Get all products
router.get('/', async (req, res) => {
  try {
    const { search, category, page = '1', limit = '50' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (category && category !== 'All') {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          stock: { include: { warehouse: true } }
        },
        orderBy: { name: 'asc' }
      }),
      prisma.product.count({ where })
    ]);

    const productsWithStatus = products.map(product => {
      const totalStock = product.stock.reduce((sum, s) => sum + Number(s.quantity), 0);
      let status: 'In Stock' | 'Low Stock' | 'Out of Stock';
      
      if (totalStock === 0) status = 'Out of Stock';
      else if (totalStock < product.reorderLevel) status = 'Low Stock';
      else status = 'In Stock';

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        unit: product.unit,
        totalStock,
        reorderLevel: product.reorderLevel,
        status,
        locations: product.stock.map(s => ({
          warehouse: s.warehouse.name,
          quantity: Number(s.quantity)
        })),
        lastUpdated: product.updatedAt.toISOString().split('T')[0]
      };
    });

    res.json({
      success: true,
      data: productsWithStatus,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        stock: { include: { warehouse: true } }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found' }
      });
    }

    const totalStock = product.stock.reduce((sum, s) => sum + Number(s.quantity), 0);
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    
    if (totalStock === 0) status = 'Out of Stock';
    else if (totalStock < product.reorderLevel) status = 'Low Stock';
    else status = 'In Stock';

    res.json({
      success: true,
      data: {
        ...product,
        totalStock,
        status,
        locations: product.stock.map(s => ({
          warehouse: s.warehouse.name,
          warehouseId: s.warehouse.id,
          quantity: Number(s.quantity)
        }))
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const { sku, name, category, unit, reorderLevel, description } = req.body;

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        category,
        unit,
        reorderLevel: parseInt(reorderLevel),
        description
      }
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: error.message }
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, category, unit, reorderLevel, description } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        category,
        unit,
        reorderLevel: parseInt(reorderLevel),
        description
      }
    });

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: error.message }
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_ERROR', message: error.message }
    });
  }
});

// Get product movements
router.get('/:id/movements', async (req, res) => {
  try {
    const movements = await prisma.stockMovement.findMany({
      where: { productId: req.params.id },
      include: { warehouse: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({
      success: true,
      data: movements.map(m => ({
        type: m.movementType,
        quantity: Number(m.quantityChange),
        docId: m.referenceNumber,
        warehouse: m.warehouse.name,
        date: m.createdAt.toISOString().split('T')[0]
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Get categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });

    res.json({
      success: true,
      data: categories.map(c => c.category)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

export default router;
