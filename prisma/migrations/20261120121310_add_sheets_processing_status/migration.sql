-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED');

-- AlterTable
ALTER TABLE "payment_fulfillments" ADD COLUMN     "sheets_claimed_at" TIMESTAMP(3),
ADD COLUMN     "sheets_status" "FulfillmentStatus" NOT NULL DEFAULT 'PENDING';
