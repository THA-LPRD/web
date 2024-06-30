-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "friendly_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "friendly_name" TEXT NOT NULL,
    "json" JSONB NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_file_path_key" ON "Asset"("file_path");
