/*
  Warnings:

  - The values [PAID,UNPAID,FAILED,CANCELED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [GOPAY] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `expiry_time` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `redirect_url` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_time` on the `payment` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('SETTLEMENT', 'PENDING', 'CANCEL', 'EXPIRE');
ALTER TABLE "payment" ALTER COLUMN "payment_status" DROP DEFAULT;
ALTER TABLE "payment" ALTER COLUMN "payment_status" TYPE "PaymentStatus_new" USING ("payment_status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "payment" ALTER COLUMN "payment_status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('BANK_TRANSFER', 'DIGITAL_WALLET', 'CREDIT_CARD', 'PAYPAL');
ALTER TABLE "payment" ALTER COLUMN "payment_type" TYPE "PaymentType_new" USING ("payment_type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "expiry_time",
DROP COLUMN "redirect_url",
DROP COLUMN "transaction_time",
ALTER COLUMN "payment_status" SET DEFAULT 'PENDING';
