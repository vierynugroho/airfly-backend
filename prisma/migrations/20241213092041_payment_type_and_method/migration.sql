/*
  Warnings:

  - Changed the type of `payment_status` on the `payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `payment_type` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "payment_status",
ADD COLUMN     "payment_status" TEXT NOT NULL,
DROP COLUMN "payment_type",
ADD COLUMN     "payment_type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PaymentType";
