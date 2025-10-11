/*
  Warnings:

  - A unique constraint covering the columns `[postId,fingerprint]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fingerprint` to the table `Like` table without a default value. This is not possible if the table is not empty.

*/

-- Primeiro, vamos adicionar a coluna fingerprint como opcional
ALTER TABLE "Like" ADD COLUMN "fingerprint" TEXT;

-- Atualizar registros existentes com um fingerprint baseado no IP + timestamp
UPDATE "Like" SET "fingerprint" = CONCAT("ipAddress", '_', EXTRACT(EPOCH FROM "createdAt")::TEXT) WHERE "fingerprint" IS NULL;

-- Agora tornar a coluna obrigatória
ALTER TABLE "Like" ALTER COLUMN "fingerprint" SET NOT NULL;

-- DropIndex
DROP INDEX "Like_postId_ipAddress_key";

-- AlterTable - tornar ipAddress opcional
ALTER TABLE "Like" ALTER COLUMN "ipAddress" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Like_fingerprint_idx" ON "Like"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "Like_postId_fingerprint_key" ON "Like"("postId", "fingerprint");