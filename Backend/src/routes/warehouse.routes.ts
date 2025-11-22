import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

// Get all warehouses
router.get('/', async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: warehouses
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Get single warehouse
router.get('/:id', async (req, res) => {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: req.params.id }
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Warehouse not found' }
      });
    }

    res.json({
      success: true,
      data: warehouse
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    });
  }
});

// Create warehouse
router.post('/', async (req, res) => {
  try {
    const { code, name, location, capacity, status } = req.body;

    const warehouse = await prisma.warehouse.create({
      data: {
        code,
        name,
        location,
        capacity,
        status: status || 'ACTIVE'
      }
    });

    res.status(201).json({
      success: true,
      data: warehouse,
      message: 'Warehouse created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: error.message }
    });
  }
});

// Update warehouse
router.put('/:id', async (req, res) => {
  try {
    const { name, location, capacity, status } = req.body;

    const warehouse = await prisma.warehouse.update({
      where: { id: req.params.id },
      data: { name, location, capacity, status }
    });

    res.json({
      success: true,
      data: warehouse,
      message: 'Warehouse updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: error.message }
    });
  }
});

// Delete warehouse
router.delete('/:id', async (req, res) => {
  try {
    await prisma.warehouse.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Warehouse deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_ERROR', message: error.message }
    });
  }
});

export default router;
