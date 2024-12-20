/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_id` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PaymentType" ADD VALUE 'QRIS';

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "transaction_id" TEXT,
ADD COLUMN     "transaction_time" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "payment_order_id_key" ON "payment"("order_id");
