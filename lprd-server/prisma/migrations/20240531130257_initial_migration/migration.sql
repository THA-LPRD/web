-- CreateTable
CREATE TABLE "Display" (
    "id" SERIAL NOT NULL,
    "mac_adr" TEXT NOT NULL,
    "friendly_name" TEXT NOT NULL,

    CONSTRAINT "Display_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Display_mac_adr_key" ON "Display"("mac_adr");
