-- CreateEnum
CREATE TYPE "ResourceRequestStatus" AS ENUM ('PENDING', 'PARTIALLY_FULFILLED', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VolunteerResponseStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "volunteer_resource_request" (
    "id" UUID NOT NULL,
    "ngoId" UUID NOT NULL,
    "requestedById" UUID NOT NULL,
    "disasterId" UUID,
    "resourceType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "requiredRole" "VolunteerRole" NOT NULL DEFAULT 'GROUND_VOLUNTEER',
    "status" "ResourceRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilledAt" TIMESTAMP(3),

    CONSTRAINT "volunteer_resource_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_resource_response" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "volunteerId" UUID NOT NULL,
    "offeredQuantity" INTEGER NOT NULL,
    "status" "VolunteerResponseStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "volunteer_resource_response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "volunteer_resource_request_ngoId_idx" ON "volunteer_resource_request"("ngoId");

-- CreateIndex
CREATE INDEX "volunteer_resource_request_requiredRole_idx" ON "volunteer_resource_request"("requiredRole");

-- CreateIndex
CREATE INDEX "volunteer_resource_request_status_idx" ON "volunteer_resource_request"("status");

-- CreateIndex
CREATE INDEX "volunteer_resource_request_disasterId_idx" ON "volunteer_resource_request"("disasterId");

-- CreateIndex
CREATE INDEX "volunteer_resource_response_volunteerId_idx" ON "volunteer_resource_response"("volunteerId");

-- CreateIndex
CREATE INDEX "volunteer_resource_response_status_idx" ON "volunteer_resource_response"("status");

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_resource_response_requestId_volunteerId_key" ON "volunteer_resource_response"("requestId", "volunteerId");

-- AddForeignKey
ALTER TABLE "volunteer_resource_request" ADD CONSTRAINT "volunteer_resource_request_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "ngo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_resource_request" ADD CONSTRAINT "volunteer_resource_request_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_resource_request" ADD CONSTRAINT "volunteer_resource_request_disasterId_fkey" FOREIGN KEY ("disasterId") REFERENCES "disaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_resource_response" ADD CONSTRAINT "volunteer_resource_response_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "volunteer_resource_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_resource_response" ADD CONSTRAINT "volunteer_resource_response_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "volunteer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
