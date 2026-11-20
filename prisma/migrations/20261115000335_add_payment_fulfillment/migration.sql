-- CreateTable
CREATE TABLE "payment_fulfillments" (
    "id" UUID NOT NULL,
    "checkout_id" UUID NOT NULL,
    "sheets_synced_at" TIMESTAMP(3),
    "entrant_emailed_at" TIMESTAMP(3),
    "admin_emailed_at" TIMESTAMP(3),
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_fulfillments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_fulfillments_checkout_id_key" ON "payment_fulfillments"("checkout_id");

-- AddForeignKey
ALTER TABLE "payment_fulfillments" ADD CONSTRAINT "payment_fulfillments_checkout_id_fkey" FOREIGN KEY ("checkout_id") REFERENCES "pending_checkouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
