import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@stockmaster.com' },
    update: {},
    create: {
      email: 'demo@stockmaster.com',
      passwordHash,
      fullName: 'Demo User',
      department: 'Operations',
      role: 'ADMIN'
    }
  });
  console.log('✅ Demo user created');

  // Create warehouses
  const mainWarehouse = await prisma.warehouse.upsert({
    where: { code: 'WH-001' },
    update: {},
    create: {
      code: 'WH-001',
      name: 'Main Warehouse',
      location: 'Building A, Floor 1',
      capacity: '5000 sqm',
      status: 'ACTIVE'
    }
  });

  const warehouse2 = await prisma.warehouse.upsert({
    where: { code: 'WH-002' },
    update: {},
    create: {
      code: 'WH-002',
      name: 'Warehouse 2',
      location: 'Building B, Floor 2',
      capacity: '3000 sqm',
      status: 'ACTIVE'
    }
  });

  const productionFloor = await prisma.warehouse.upsert({
    where: { code: 'WH-003' },
    update: {},
    create: {
      code: 'WH-003',
      name: 'Production Floor',
      location: 'Building C',
      capacity: '2000 sqm',
      status: 'ACTIVE'
    }
  });
  console.log('✅ Warehouses created');

  // Create products
  const steelRods = await prisma.product.upsert({
    where: { sku: 'SR-2024-001' },
    update: {},
    create: {
      sku: 'SR-2024-001',
      name: 'Steel Rods',
      category: 'Raw Materials',
      unit: 'kg',
      reorderLevel: 100,
      description: 'High-grade steel rods for construction'
    }
  });

  const officeChairs = await prisma.product.upsert({
    where: { sku: 'CH-2024-002' },
    update: {},
    create: {
      sku: 'CH-2024-002',
      name: 'Office Chairs',
      category: 'Finished Goods',
      unit: 'units',
      reorderLevel: 50,
      description: 'Ergonomic office chairs'
    }
  });

  const bolts = await prisma.product.upsert({
    where: { sku: 'BT-2024-003' },
    update: {},
    create: {
      sku: 'BT-2024-003',
      name: 'Bolts M8',
      category: 'Spare Parts',
      unit: 'units',
      reorderLevel: 500,
      description: 'M8 bolts for assembly'
    }
  });

  const packagingBoxes = await prisma.product.upsert({
    where: { sku: 'PB-2024-004' },
    update: {},
    create: {
      sku: 'PB-2024-004',
      name: 'Packaging Boxes',
      category: 'Packaging Material',
      unit: 'boxes',
      reorderLevel: 100,
      description: 'Cardboard packaging boxes'
    }
  });

  const cuttingTools = await prisma.product.upsert({
    where: { sku: 'CT-2024-005' },
    update: {},
    create: {
      sku: 'CT-2024-005',
      name: 'Cutting Tools',
      category: 'Tools',
      unit: 'units',
      reorderLevel: 20,
      description: 'Industrial cutting tools'
    }
  });

  const lubricantOil = await prisma.product.upsert({
    where: { sku: 'LO-2024-006' },
    update: {},
    create: {
      sku: 'LO-2024-006',
      name: 'Lubricant Oil',
      category: 'Consumables',
      unit: 'liters',
      reorderLevel: 30,
      description: 'Industrial lubricant oil'
    }
  });
  console.log('✅ Products created');

  // Create initial stock
  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: steelRods.id,
        warehouseId: mainWarehouse.id
      }
    },
    update: {},
    create: {
      productId: steelRods.id,
      warehouseId: mainWarehouse.id,
      quantity: 120
    }
  });

  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: steelRods.id,
        warehouseId: productionFloor.id
      }
    },
    update: {},
    create: {
      productId: steelRods.id,
      warehouseId: productionFloor.id,
      quantity: 40
    }
  });

  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: steelRods.id,
        warehouseId: warehouse2.id
      }
    },
    update: {},
    create: {
      productId: steelRods.id,
      warehouseId: warehouse2.id,
      quantity: 60
    }
  });

  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: officeChairs.id,
        warehouseId: mainWarehouse.id
      }
    },
    update: {},
    create: {
      productId: officeChairs.id,
      warehouseId: mainWarehouse.id,
      quantity: 30
    }
  });

  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: officeChairs.id,
        warehouseId: warehouse2.id
      }
    },
    update: {},
    create: {
      productId: officeChairs.id,
      warehouseId: warehouse2.id,
      quantity: 15
    }
  });

  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: packagingBoxes.id,
        warehouseId: mainWarehouse.id
      }
    },
    update: {},
    create: {
      productId: packagingBoxes.id,
      warehouseId: mainWarehouse.id,
      quantity: 200
    }
  });

  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: packagingBoxes.id,
        warehouseId: productionFloor.id
      }
    },
    update: {},
    create: {
      productId: packagingBoxes.id,
      warehouseId: productionFloor.id,
      quantity: 150
    }
  });

  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: cuttingTools.id,
        warehouseId: mainWarehouse.id
      }
    },
    update: {},
    create: {
      productId: cuttingTools.id,
      warehouseId: mainWarehouse.id,
      quantity: 15
    }
  });

  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: cuttingTools.id,
        warehouseId: productionFloor.id
      }
    },
    update: {},
    create: {
      productId: cuttingTools.id,
      warehouseId: productionFloor.id,
      quantity: 10
    }
  });

  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: lubricantOil.id,
        warehouseId: mainWarehouse.id
      }
    },
    update: {},
    create: {
      productId: lubricantOil.id,
      warehouseId: mainWarehouse.id,
      quantity: 10
    }
  });

  await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId: lubricantOil.id,
        warehouseId: productionFloor.id
      }
    },
    update: {},
    create: {
      productId: lubricantOil.id,
      warehouseId: productionFloor.id,
      quantity: 8
    }
  });
  console.log('✅ Initial stock created');

  // Create sample receipts
  const receipt1 = await prisma.receipt.create({
    data: {
      receiptNumber: 'R-120',
      supplierName: 'Vendor ABC',
      warehouseId: mainWarehouse.id,
      status: 'WAITING',
      expectedDate: new Date('2024-11-20'),
      createdBy: demoUser.id,
      lines: {
        create: [
          {
            productId: steelRods.id,
            quantity: 50,
            unit: 'kg'
          },
          {
            productId: bolts.id,
            quantity: 200,
            unit: 'units'
          }
        ]
      }
    }
  });

  const receipt2 = await prisma.receipt.create({
    data: {
      receiptNumber: 'R-121',
      supplierName: 'Vendor DEF',
      warehouseId: warehouse2.id,
      status: 'DRAFT',
      expectedDate: new Date('2024-11-22'),
      createdBy: demoUser.id,
      lines: {
        create: [
          {
            productId: packagingBoxes.id,
            quantity: 100,
            unit: 'boxes'
          }
        ]
      }
    }
  });
  console.log('✅ Sample receipts created');

  // Create sample deliveries
  const delivery1 = await prisma.delivery.create({
    data: {
      deliveryNumber: 'D-211',
      customerName: 'Customer XYZ',
      warehouseId: mainWarehouse.id,
      status: 'READY',
      deliveryDate: new Date('2024-11-21'),
      createdBy: demoUser.id,
      lines: {
        create: [
          {
            productId: officeChairs.id,
            quantity: 10,
            unit: 'units'
          }
        ]
      }
    }
  });

  const delivery2 = await prisma.delivery.create({
    data: {
      deliveryNumber: 'D-212',
      customerName: 'Customer ABC',
      warehouseId: warehouse2.id,
      status: 'PICKING',
      deliveryDate: new Date('2024-11-21'),
      createdBy: demoUser.id,
      lines: {
        create: [
          {
            productId: officeChairs.id,
            quantity: 5,
            unit: 'units'
          }
        ]
      }
    }
  });
  console.log('✅ Sample deliveries created');

  // Create sample transfers
  const transfer1 = await prisma.transfer.create({
    data: {
      transferNumber: 'T-90',
      productId: packagingBoxes.id,
      fromWarehouseId: mainWarehouse.id,
      toWarehouseId: productionFloor.id,
      quantity: 25,
      status: 'DONE',
      transferDate: new Date('2024-11-19'),
      completedAt: new Date('2024-11-19'),
      createdBy: demoUser.id
    }
  });

  const transfer2 = await prisma.transfer.create({
    data: {
      transferNumber: 'T-91',
      productId: cuttingTools.id,
      fromWarehouseId: warehouse2.id,
      toWarehouseId: mainWarehouse.id,
      quantity: 15,
      status: 'READY',
      transferDate: new Date('2024-11-20'),
      createdBy: demoUser.id
    }
  });
  console.log('✅ Sample transfers created');

  // Create sample adjustments
  const adjustment1 = await prisma.adjustment.create({
    data: {
      adjustmentNumber: 'A-45',
      productId: steelRods.id,
      warehouseId: mainWarehouse.id,
      recordedQuantity: 223,
      countedQuantity: 220,
      difference: -3,
      reason: 'Damaged goods',
      adjustmentDate: new Date('2024-11-18'),
      createdBy: demoUser.id
    }
  });

  const adjustment2 = await prisma.adjustment.create({
    data: {
      adjustmentNumber: 'A-46',
      productId: bolts.id,
      warehouseId: mainWarehouse.id,
      recordedQuantity: 195,
      countedQuantity: 200,
      difference: 5,
      reason: 'Found in storage',
      adjustmentDate: new Date('2024-11-20'),
      createdBy: demoUser.id
    }
  });
  console.log('✅ Sample adjustments created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
