-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "friendly_name" DROP NOT NULL,
ALTER COLUMN "file_path" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Display" ADD COLUMN     "last_seen" TIMESTAMP(3),
ALTER COLUMN "friendly_name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" ALTER COLUMN "friendly_name" DROP NOT NULL,
ALTER COLUMN "json" DROP NOT NULL;
