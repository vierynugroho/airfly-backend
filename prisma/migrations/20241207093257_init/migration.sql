/*
  Warnings:

  - You are about to drop the column `bookingCode` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bookings_bookingCode_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "bookingCode",
ADD COLUMN     "code" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "bookings_code_key" ON "bookings"("code");
