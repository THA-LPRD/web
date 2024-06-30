/*
  Warnings:

  - Added the required column `colordepth` to the `Display` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Display` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Display` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "html" TEXT;

-- AlterTable
ALTER TABLE "Display" ADD COLUMN     "colordepth" INTEGER NOT NULL,
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
