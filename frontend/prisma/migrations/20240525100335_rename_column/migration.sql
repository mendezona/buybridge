-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "ean" TEXT NOT NULL,
    "fbmSeller" TEXT NOT NULL,
    "fba" TEXT NOT NULL,
    "amazonPrice" DECIMAL(10,2) NOT NULL,
    "amazonStockLevel" TEXT NOT NULL,
    "amazonShippingFee" DECIMAL(10,2) NOT NULL,
    "kauflandPrice" DECIMAL(10,2) NOT NULL,
    "kauflandOffer" TEXT NOT NULL,
    "kauflandSellerFee" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Item_id_idx" ON "Item"("id");
