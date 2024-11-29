/*
  Warnings:

  - You are about to drop the column `bookingId` on the `passengers` table. All the data in the column will be lost.
  - You are about to drop the column `seatId` on the `passengers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "passengers" DROP CONSTRAINT "passengers_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "passengers" DROP CONSTRAINT "passengers_seatId_fkey";

-- AlterTable
ALTER TABLE "passengers" DROP COLUMN "bookingId",
DROP COLUMN "seatId";
