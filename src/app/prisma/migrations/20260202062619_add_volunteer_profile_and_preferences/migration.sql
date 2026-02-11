-- CreateEnum
CREATE TYPE "VolunteerRole" AS ENUM ('GROUND_VOLUNTEER', 'MEDICAL_VOLUNTEER', 'RESCUE_VOLUNTEER', 'RELIEF_VOLUNTEER', 'DATA_VOLUNTEER', 'COMMUNICATION_VOLUNTEER', 'VOLUNTEER_LEAD');

-- CreateEnum
CREATE TYPE "VolunteerRolePreference" AS ENUM ('GROUND', 'MEDICAL', 'RESCUE', 'RELIEF', 'DATA', 'COMMUNICATION');

-- CreateTable
CREATE TABLE "volunteer" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "ngoId" UUID NOT NULL,
    "role" "VolunteerRole" NOT NULL DEFAULT 'GROUND_VOLUNTEER',
    "rolePreference" "VolunteerRolePreference",
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "state" TEXT NOT NULL,
    "district" TEXT,
    "address" TEXT,
    "dob" TIMESTAMP(3),
    "gender" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experienceYears" INTEGER,
    "certificationUrl" TEXT,
    "canTravel" BOOLEAN NOT NULL DEFAULT false,
    "hasVehicle" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_userId_key" ON "volunteer"("userId");

-- CreateIndex
CREATE INDEX "volunteer_ngoId_idx" ON "volunteer"("ngoId");

-- CreateIndex
CREATE INDEX "volunteer_role_idx" ON "volunteer"("role");

-- CreateIndex
CREATE INDEX "volunteer_state_idx" ON "volunteer"("state");

-- CreateIndex
CREATE INDEX "volunteer_available_idx" ON "volunteer"("available");

-- AddForeignKey
ALTER TABLE "volunteer" ADD CONSTRAINT "volunteer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer" ADD CONSTRAINT "volunteer_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "ngo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
