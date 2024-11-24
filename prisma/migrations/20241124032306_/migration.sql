/*
  Warnings:

  - Added the required column `information` to the `flights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terminal` to the `flights` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "flights" ADD COLUMN     "information" TEXT NOT NULL,
ADD COLUMN     "terminal" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "passengers" ALTER COLUMN "gender" SET DEFAULT 'MALE',
ALTER COLUMN "title" SET DEFAULT 'Mr',
ALTER COLUMN "type" SET DEFAULT 'ADULT';

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "seats" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE',
ALTER COLUMN "class" SET DEFAULT 'ECONOMY';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'UNVERIFIED',
ALTER COLUMN "role" SET DEFAULT 'BUYER';
