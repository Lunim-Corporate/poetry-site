/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_ghost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripe_customer_id" VARCHAR(255),
ALTER COLUMN "password_hash" DROP NOT NULL;

-- CreateTable
CREATE TABLE "pending_checkouts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "stripe_payment_intent_id" VARCHAR(255),
    "entry_token" VARCHAR(100) NOT NULL,
    "book_titles" TEXT[],
    "expected_amount_pence" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'gbp',
    "status" "CheckoutStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_checkouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pending_checkouts_stripe_payment_intent_id_key" ON "pending_checkouts"("stripe_payment_intent_id");

-- CreateIndex
CREATE UNIQUE INDEX "pending_checkouts_entry_token_key" ON "pending_checkouts"("entry_token");

-- CreateIndex
CREATE INDEX "pending_checkouts_user_id_idx" ON "pending_checkouts"("user_id");

-- CreateIndex
CREATE INDEX "pending_checkouts_competition_id_idx" ON "pending_checkouts"("competition_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- AddForeignKey
ALTER TABLE "pending_checkouts" ADD CONSTRAINT "pending_checkouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_checkouts" ADD CONSTRAINT "pending_checkouts_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
