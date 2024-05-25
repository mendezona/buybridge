/*
  Warnings:

  - Added the required column `amazonLink` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kauflandLink` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "amazonLink" TEXT NOT NULL,
ADD COLUMN     "kauflandLink" TEXT NOT NULL;
