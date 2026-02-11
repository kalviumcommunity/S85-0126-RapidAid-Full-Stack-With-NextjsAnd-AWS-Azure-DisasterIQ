-- CreateEnum
CREATE TYPE "RolePreferenceRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "role_preference_request" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "ngoId" UUID NOT NULL,
    "state" TEXT NOT NULL,
    "preferredRole" TEXT NOT NULL,
    "status" "RolePreferenceRequestStatus" NOT NULL DEFAULT 'PENDING',
    "approvedRole" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_preference_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "role_preference_request_ngoId_idx" ON "role_preference_request"("ngoId");

-- CreateIndex
CREATE INDEX "role_preference_request_state_idx" ON "role_preference_request"("state");

-- CreateIndex
CREATE INDEX "role_preference_request_status_idx" ON "role_preference_request"("status");

-- CreateIndex
CREATE INDEX "role_preference_request_createdAt_idx" ON "role_preference_request"("createdAt");

-- CreateIndex
CREATE INDEX "role_preference_request_ngoId_state_idx" ON "role_preference_request"("ngoId", "state");

-- CreateIndex
CREATE UNIQUE INDEX "role_preference_request_userId_ngoId_key" ON "role_preference_request"("userId", "ngoId");

-- AddForeignKey
ALTER TABLE "role_preference_request" ADD CONSTRAINT "role_preference_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_preference_request" ADD CONSTRAINT "role_preference_request_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "ngo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_preference_request" ADD CONSTRAINT "role_preference_request_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
