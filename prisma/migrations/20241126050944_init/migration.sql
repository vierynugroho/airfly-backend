/*
  Warnings:

  - You are about to drop the column `booking_id` on the `passengers` table. All the data in the column will be lost.
  - You are about to drop the column `seat_id` on the `passengers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "passengers" DROP CONSTRAINT "passengers_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "passengers" DROP CONSTRAINT "passengers_seat_id_fkey";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "passengers" DROP COLUMN "booking_id",
DROP COLUMN "seat_id",
ADD COLUMN     "bookingId" INTEGER,
ADD COLUMN     "seatId" INTEGER;

-- CreateTable
CREATE TABLE "booking_details" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_details_passenger_id_key" ON "booking_details"("passenger_id");

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "passengers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
