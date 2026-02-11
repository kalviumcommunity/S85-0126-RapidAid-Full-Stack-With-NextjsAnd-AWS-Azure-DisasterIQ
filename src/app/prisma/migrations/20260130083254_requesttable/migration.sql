-- CreateEnum
CREATE TYPE "NGORequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "ngo_request" (
    "id" UUID NOT NULL,
    "disasterId" UUID NOT NULL,
    "ngoId" UUID NOT NULL,
    "status" "NGORequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedById" UUID NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ngo_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ngo_request_status_idx" ON "ngo_request"("status");

-- CreateIndex
CREATE INDEX "ngo_request_createdAt_idx" ON "ngo_request"("createdAt");

-- CreateIndex
CREATE INDEX "ngo_request_disasterId_idx" ON "ngo_request"("disasterId");

-- CreateIndex
CREATE INDEX "ngo_request_ngoId_idx" ON "ngo_request"("ngoId");

-- CreateIndex
CREATE UNIQUE INDEX "ngo_request_disasterId_ngoId_key" ON "ngo_request"("disasterId", "ngoId");

-- CreateIndex
CREATE INDEX "audit_log_userId_idx" ON "audit_log"("userId");

-- CreateIndex
CREATE INDEX "audit_log_timestamp_idx" ON "audit_log"("timestamp");

-- CreateIndex
CREATE INDEX "audit_log_entity_idx" ON "audit_log"("entity");

-- CreateIndex
CREATE INDEX "audit_log_entity_entityId_idx" ON "audit_log"("entity", "entityId");

-- CreateIndex
CREATE INDEX "disaster_governmentId_idx" ON "disaster"("governmentId");

-- CreateIndex
CREATE INDEX "disaster_status_idx" ON "disaster"("status");

-- CreateIndex
CREATE INDEX "disaster_reportedAt_idx" ON "disaster"("reportedAt");

-- CreateIndex
CREATE INDEX "disaster_governmentId_reportedAt_idx" ON "disaster"("governmentId", "reportedAt");

-- CreateIndex
CREATE INDEX "disaster_metric_lastUpdated_idx" ON "disaster_metric"("lastUpdated");

-- CreateIndex
CREATE INDEX "government_createdAt_idx" ON "government"("createdAt");

-- CreateIndex
CREATE INDEX "hospital_createdAt_idx" ON "hospital"("createdAt");

-- CreateIndex
CREATE INDEX "hospital_state_district_idx" ON "hospital"("state", "district");

-- CreateIndex
CREATE INDEX "media_disasterId_idx" ON "media"("disasterId");

-- CreateIndex
CREATE INDEX "media_uploadedByGovernmentId_idx" ON "media"("uploadedByGovernmentId");

-- CreateIndex
CREATE INDEX "media_createdAt_idx" ON "media"("createdAt");

-- CreateIndex
CREATE INDEX "medical_report_hospitalId_idx" ON "medical_report"("hospitalId");

-- CreateIndex
CREATE INDEX "medical_report_victimId_idx" ON "medical_report"("victimId");

-- CreateIndex
CREATE INDEX "medical_report_createdById_idx" ON "medical_report"("createdById");

-- CreateIndex
CREATE INDEX "medical_report_reportedAt_idx" ON "medical_report"("reportedAt");

-- CreateIndex
CREATE INDEX "ngo_createdAt_idx" ON "ngo"("createdAt");

-- CreateIndex
CREATE INDEX "ngo_state_district_idx" ON "ngo"("state", "district");

-- CreateIndex
CREATE INDEX "police_createdAt_idx" ON "police"("createdAt");

-- CreateIndex
CREATE INDEX "police_state_district_idx" ON "police"("state", "district");

-- CreateIndex
CREATE INDEX "rescue_assignment_disasterId_idx" ON "rescue_assignment"("disasterId");

-- CreateIndex
CREATE INDEX "rescue_assignment_rescueTeamId_idx" ON "rescue_assignment"("rescueTeamId");

-- CreateIndex
CREATE INDEX "rescue_assignment_assignedAt_idx" ON "rescue_assignment"("assignedAt");

-- CreateIndex
CREATE INDEX "rescue_assignment_disasterId_rescueTeamId_idx" ON "rescue_assignment"("disasterId", "rescueTeamId");

-- CreateIndex
CREATE INDEX "rescue_team_status_idx" ON "rescue_team"("status");

-- CreateIndex
CREATE INDEX "resource_createdById_idx" ON "resource"("createdById");

-- CreateIndex
CREATE INDEX "resource_type_idx" ON "resource"("type");

-- CreateIndex
CREATE INDEX "resource_allocation_disasterId_idx" ON "resource_allocation"("disasterId");

-- CreateIndex
CREATE INDEX "resource_allocation_resourceId_idx" ON "resource_allocation"("resourceId");

-- CreateIndex
CREATE INDEX "resource_allocation_allocatedAt_idx" ON "resource_allocation"("allocatedAt");

-- CreateIndex
CREATE INDEX "resource_allocation_disasterId_resourceId_idx" ON "resource_allocation"("disasterId", "resourceId");

-- CreateIndex
CREATE INDEX "shelter_createdById_idx" ON "shelter"("createdById");

-- CreateIndex
CREATE INDEX "shelter_createdAt_idx" ON "shelter"("createdAt");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt");

-- CreateIndex
CREATE INDEX "user_governmentId_idx" ON "user"("governmentId");

-- CreateIndex
CREATE INDEX "user_policeId_idx" ON "user"("policeId");

-- CreateIndex
CREATE INDEX "user_ngoId_idx" ON "user"("ngoId");

-- CreateIndex
CREATE INDEX "user_hospitalId_idx" ON "user"("hospitalId");

-- CreateIndex
CREATE INDEX "user_role_roleId_idx" ON "user_role"("roleId");

-- CreateIndex
CREATE INDEX "victim_disasterId_idx" ON "victim"("disasterId");

-- CreateIndex
CREATE INDEX "victim_rescued_idx" ON "victim"("rescued");

-- CreateIndex
CREATE INDEX "victim_createdAt_idx" ON "victim"("createdAt");

-- AddForeignKey
ALTER TABLE "ngo_request" ADD CONSTRAINT "ngo_request_disasterId_fkey" FOREIGN KEY ("disasterId") REFERENCES "disaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ngo_request" ADD CONSTRAINT "ngo_request_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "ngo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ngo_request" ADD CONSTRAINT "ngo_request_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
