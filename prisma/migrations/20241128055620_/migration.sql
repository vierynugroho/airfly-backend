/*
  Warnings:

  - You are about to drop the column `arrivalDate` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `departureDate` on the `seats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "seats" DROP COLUMN "arrivalDate",
DROP COLUMN "departureDate",
ADD COLUMN     "arrivalTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "departureTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
