import { VolunteerAdminRepository } from "@/app/repositories/volunteerAdmin.repository";
import { prisma } from "@/app/prisma/prisma";
import { VolunteerRole } from "@prisma/client";

type AdminUserContext = {
  id: string;
  ngoId?: string | null;
  role?: string;
};

export const VolunteerAdminService = {
  listRoleRequests: async (ngoId: string, page = 1, pageSize = 10) => {
    const skip = (page - 1) * pageSize;
    return VolunteerAdminRepository.findPendingByNgo(ngoId, skip, pageSize);
  },

  approveRole: async (volunteerId: string, approvedRole: string, admin: AdminUserContext) => {
    // Validate admin context
    if (!admin || !admin.id || !admin.ngoId) {
      throw { code: "UNAUTHORIZED", message: "Admin context missing" };
    }

    // Validate role exists in enum
    const allowed = Object.values(VolunteerRole) as string[];
    if (!allowed.includes(approvedRole)) {
      throw { code: "VALIDATION_ERROR", message: "Invalid role" };
    }

    // Fetch volunteer
    const vol = await VolunteerAdminRepository.findById(volunteerId);
    if (!vol) throw { code: "NOT_FOUND", message: "Volunteer not found" };

    // Security checks
    if (vol.userId === admin.id) {
      throw { code: "FORBIDDEN", message: "Cannot approve yourself" };
    }

    if (vol.ngoId !== admin.ngoId) {
      throw { code: "FORBIDDEN", message: "Cannot manage volunteers from other NGOs" };
    }

    // Do not allow approving if already verified
    if (vol.verified) {
      throw { code: "CONFLICT", message: "Volunteer already verified" };
    }

    // Approve: set role, verified, verifiedAt and create audit log (repo does TX)
    const updated = await VolunteerAdminRepository.approveRole(volunteerId, approvedRole, admin.id);
    return updated;
  },

  rejectRole: async (volunteerId: string, admin: AdminUserContext) => {
    if (!admin || !admin.id || !admin.ngoId) {
      throw { code: "UNAUTHORIZED", message: "Admin context missing" };
    }

    const vol = await VolunteerAdminRepository.findById(volunteerId);
    if (!vol) throw { code: "NOT_FOUND", message: "Volunteer not found" };

    if (vol.userId === admin.id) {
      throw { code: "FORBIDDEN", message: "Cannot reject yourself" };
    }

    if (vol.ngoId !== admin.ngoId) {
      throw { code: "FORBIDDEN", message: "Cannot manage volunteers from other NGOs" };
    }

    if (!vol.rolePreference) {
      throw { code: "VALIDATION_ERROR", message: "No role preference to reject" };
    }

    const updated = await VolunteerAdminRepository.rejectRole(volunteerId, admin.id);
    return updated;
  },
};
