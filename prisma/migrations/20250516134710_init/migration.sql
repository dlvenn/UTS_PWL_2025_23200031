/*
  Warnings:

  - A unique constraint covering the columns `[kode]` on the table `paket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "paket_kode_key" ON "paket"("kode");
