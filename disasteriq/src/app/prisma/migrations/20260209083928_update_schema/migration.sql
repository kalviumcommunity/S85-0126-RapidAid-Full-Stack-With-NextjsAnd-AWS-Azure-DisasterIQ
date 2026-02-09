/*
  Warnings:

  - The values [RELIEF_VOLUNTEER,DATA_VOLUNTEER,COMMUNICATION_VOLUNTEER,VOLUNTEER_LEAD] on the enum `VolunteerRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [RELIEF,DATA,COMMUNICATION] on the enum `VolunteerRolePreference` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VolunteerRole_new" AS ENUM ('GROUND_VOLUNTEER', 'MEDICAL_VOLUNTEER', 'RESCUE_VOLUNTEER');
ALTER TABLE "volunteer" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "volunteer" ALTER COLUMN "role" TYPE "VolunteerRole_new" USING ("role"::text::"VolunteerRole_new");
ALTER TYPE "VolunteerRole" RENAME TO "VolunteerRole_old";
ALTER TYPE "VolunteerRole_new" RENAME TO "VolunteerRole";
DROP TYPE "VolunteerRole_old";
ALTER TABLE "volunteer" ALTER COLUMN "role" SET DEFAULT 'GROUND_VOLUNTEER';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "VolunteerRolePreference_new" AS ENUM ('GROUND', 'MEDICAL', 'RESCUE');
ALTER TABLE "volunteer" ALTER COLUMN "rolePreference" TYPE "VolunteerRolePreference_new" USING ("rolePreference"::text::"VolunteerRolePreference_new");
ALTER TYPE "VolunteerRolePreference" RENAME TO "VolunteerRolePreference_old";
ALTER TYPE "VolunteerRolePreference_new" RENAME TO "VolunteerRolePreference";
DROP TYPE "VolunteerRolePreference_old";
COMMIT;
