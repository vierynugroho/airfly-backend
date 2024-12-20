-- AlterTable
ALTER TABLE "booking_details" ADD COLUMN     "qrCodeImage" TEXT,
ADD COLUMN     "qrToken" TEXT;

-- AlterTable
ALTER TABLE "passengers" ALTER COLUMN "country_of_issue" DROP NOT NULL,
ALTER COLUMN "expired_Date" DROP NOT NULL;
