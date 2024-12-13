-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "type" DROP NOT NULL;
