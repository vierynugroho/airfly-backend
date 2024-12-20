/*
  Warnings:

  - You are about to alter the column `total_price` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `payment_amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `class` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `seats` table. All the data in the column will be lost.
  - Added the required column `price` to the `flights` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'DISCOUNT', 'PROMO', 'EVENT', 'TRAVEL', 'BOOKING');

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "total_price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "flights" ADD COLUMN     "class" "SeatClass" NOT NULL DEFAULT 'ECONOMY',
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "payment_amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "seats" DROP COLUMN "class",
DROP COLUMN "price";

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
