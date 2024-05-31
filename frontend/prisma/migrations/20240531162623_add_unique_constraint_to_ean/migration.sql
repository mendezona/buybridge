/*
  Warnings:

  - A unique constraint covering the columns `[ean]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item_ean_key" ON "Item"("ean");
