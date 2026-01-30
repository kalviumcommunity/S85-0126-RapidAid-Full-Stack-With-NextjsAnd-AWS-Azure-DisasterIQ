/*
  Warnings:

  - Added the required column `governmentId` to the `ngo_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ngo_request" ADD COLUMN     "governmentId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "ngo_request_governmentId_idx" ON "ngo_request"("governmentId");

-- AddForeignKey
ALTER TABLE "ngo_request" ADD CONSTRAINT "ngo_request_governmentId_fkey" FOREIGN KEY ("governmentId") REFERENCES "government"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
