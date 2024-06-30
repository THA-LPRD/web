/*
  Warnings:

  - The primary key for the `Display` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Display` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Display" DROP CONSTRAINT "Display_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Display_pkey" PRIMARY KEY ("mac_adr");
