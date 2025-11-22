-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'STAFF');

-- CreateEnum
CREATE TYPE "WarehouseStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('DRAFT', 'WAITING', 'VALIDATED');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('DRAFT', 'PICKING', 'PACKING', 'READY', 'SHIPPED');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('READY', 'DONE');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('RECEIPT', 'DELIVERY', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "department" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "status" "WarehouseStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "reorder_level" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" TEXT NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "status" "ReceiptStatus" NOT NULL DEFAULT 'DRAFT',
    "expected_date" DATE NOT NULL,
    "validated_at" TIMESTAMP(3),
    "validated_by" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_lines" (
    "id" TEXT NOT NULL,
    "receipt_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "receipt_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "delivery_number" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'DRAFT',
    "delivery_date" DATE NOT NULL,
    "shipped_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_lines" (
    "id" TEXT NOT NULL,
    "delivery_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "delivery_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" TEXT NOT NULL,
    "transfer_number" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "from_warehouse_id" TEXT NOT NULL,
    "to_warehouse_id" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'READY',
    "transfer_date" DATE NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adjustments" (
    "id" TEXT NOT NULL,
    "adjustment_number" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "recorded_quantity" DECIMAL(10,2) NOT NULL,
    "counted_quantity" DECIMAL(10,2) NOT NULL,
    "difference" DECIMAL(10,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "adjustment_date" DATE NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "movement_type" "MovementType" NOT NULL,
    "reference_id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "quantity_change" DECIMAL(10,2) NOT NULL,
    "quantity_before" DECIMAL(10,2) NOT NULL,
    "quantity_after" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "stock_product_id_warehouse_id_key" ON "stock"("product_id", "warehouse_id");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_receipt_number_key" ON "receipts"("receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "deliveries_delivery_number_key" ON "deliveries"("delivery_number");

-- CreateIndex
CREATE UNIQUE INDEX "transfers_transfer_number_key" ON "transfers"("transfer_number");

-- CreateIndex
CREATE UNIQUE INDEX "adjustments_adjustment_number_key" ON "adjustments"("adjustment_number");

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_validated_by_fkey" FOREIGN KEY ("validated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_lines" ADD CONSTRAINT "receipt_lines_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_lines" ADD CONSTRAINT "receipt_lines_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_lines" ADD CONSTRAINT "delivery_lines_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_lines" ADD CONSTRAINT "delivery_lines_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_warehouse_id_fkey" FOREIGN KEY ("from_warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_warehouse_id_fkey" FOREIGN KEY ("to_warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adjustments" ADD CONSTRAINT "adjustments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adjustments" ADD CONSTRAINT "adjustments_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adjustments" ADD CONSTRAINT "adjustments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
