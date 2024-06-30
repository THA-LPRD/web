/*
  Warnings:

  - You are about to drop the column `file_path` on the `Asset` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Asset_file_path_key";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "file_path";
