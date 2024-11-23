/*
  Warnings:

  - You are about to drop the column `image` on the `airlines` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `flights` table. All the data in the column will be lost.
  - Changed the type of `payment_method` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `class` to the `seats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `seats` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeatClass" AS ENUM ('ECONOMY', 'FIRST', 'BUSINESS');

-- AlterTable
ALTER TABLE "airlines" DROP COLUMN "image",
ADD COLUMN     "imageId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "airports" ADD COLUMN     "imageId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "latitude" SET DATA TYPE TEXT,
ALTER COLUMN "longitude" SET DATA TYPE TEXT,
ALTER COLUMN "elevation" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "return_flight_id" INTEGER;

-- AlterTable
ALTER TABLE "flights" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "payment_method",
ADD COLUMN     "payment_method" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "seats" ADD COLUMN     "class" "SeatClass" NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "seat_number" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "PaymenMethod";

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_return_flight_id_fkey" FOREIGN KEY ("return_flight_id") REFERENCES "flights"("id") ON DELETE SET NULL ON UPDATE CASCADE;
