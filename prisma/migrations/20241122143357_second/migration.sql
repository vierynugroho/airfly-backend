/*
  Warnings:

  - You are about to drop the column `otp_expiration` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "otp_expiration",
ALTER COLUMN "secret_key" SET DEFAULT '',
ALTER COLUMN "otp_token" SET DEFAULT '';
