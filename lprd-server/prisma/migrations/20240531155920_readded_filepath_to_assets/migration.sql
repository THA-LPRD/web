/*
  Warnings:

  - Added the required column `file_path` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "file_path" TEXT NOT NULL;
