/*
  Warnings:

  - A unique constraint covering the columns `[pending_checkout_id]` on the table `submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "pending_checkout_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "submissions_pending_checkout_id_key" ON "submissions"("pending_checkout_id");

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_pending_checkout_id_fkey" FOREIGN KEY ("pending_checkout_id") REFERENCES "pending_checkouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
