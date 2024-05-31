/*
  Warnings:

  - A unique constraint covering the columns `[asin]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Item_ean_idx";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "asin" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Item_asin_key" ON "Item"("asin");

-- RenameIndex
ALTER INDEX "unique_ean" RENAME TO "Item_ean_key";
