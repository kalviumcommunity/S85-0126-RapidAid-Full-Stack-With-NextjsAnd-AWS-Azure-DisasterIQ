/*
  Warnings:

  - You are about to drop the column `district` on the `ngo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ngo_state_district_idx";

-- AlterTable
ALTER TABLE "ngo" DROP COLUMN "district";

-- CreateIndex
CREATE INDEX "ngo_state_idx" ON "ngo"("state");
