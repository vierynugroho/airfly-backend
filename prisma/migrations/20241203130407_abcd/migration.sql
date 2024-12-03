/*
  Warnings:

  - A unique constraint covering the columns `[bookingCode]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingCode` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "bookingCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingCode_key" ON "bookings"("bookingCode");
