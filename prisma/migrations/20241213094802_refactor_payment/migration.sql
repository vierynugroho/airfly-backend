/*
  Warnings:

  - You are about to drop the column `payment_amount` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `payment_status` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `payment_type` on the `payment` table. All the data in the column will be lost.
  - Added the required column `amount` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "payment_amount",
DROP COLUMN "payment_status",
DROP COLUMN "payment_type",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
