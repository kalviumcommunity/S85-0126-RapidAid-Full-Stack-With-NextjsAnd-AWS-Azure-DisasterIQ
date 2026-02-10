import {
  findPendingRoleRequest,
  approveRoleRequest,
  rejectRoleRequest,
  upsertVolunteer,
} from "@/app/repositories/rolePreferenceRequest.repository";

type ApproveRoleInput = {
  adminUserId: string;
  adminRole: string;
  adminNgoId: string | undefined;
  targetUserId: string;
};

type RejectRoleInput = {
  adminUserId: string;
  adminRole: string;
  adminNgoId: string | undefined;
  targetUserId: string;
};

export const RolePreferenceService = {
  approveByNGOAdmin: async ({
    adminUserId,
    adminRole,
    adminNgoId,
    targetUserId,
  }: ApproveRoleInput) => {
    // 1️⃣ Role check
    if (adminRole !== "NGO_ADMIN") {
      throw new Error("Only NGO admin can approve role requests");
    }

    if (!adminNgoId) {
      throw new Error("NGO context missing for admin");
    }

    if (!targetUserId) {
      throw new Error("Target userId missing");
    }

    // 2️⃣ Find pending request
    const request = await findPendingRoleRequest(
      targetUserId,
      adminNgoId
    );

    if (!request) {
      throw new Error("No pending role request found");
    }

    // 3️⃣ Approve request
    const approved = await approveRoleRequest({
      requestId: request.id,
      approvedBy: adminUserId,
      approvedRole: request.preferredRole,
    });

    // 4️⃣ Create / update volunteer
    await upsertVolunteer({
      userId: targetUserId,
      ngoId: adminNgoId,
      role: request.preferredRole,
      state: request.state,
    });

    return approved;
  },

  rejectByNGOAdmin: async ({
   
    adminRole,
    adminNgoId,
    targetUserId,
  }: RejectRoleInput) => {
    // 1️⃣ Role check
    if (adminRole !== "NGO_ADMIN") {
      throw new Error("Only NGO admin can reject role requests");
    }

    if (!adminNgoId) {
      throw new Error("NGO context missing for admin");
    }

    if (!targetUserId) {
      throw new Error("Target userId missing");
    }

    // 2️⃣ Find pending request
    const request = await findPendingRoleRequest(
      targetUserId,
      adminNgoId
    );

    if (!request) {
      throw new Error("No pending role request found");
    }

    // 3️⃣ Reject request
    const rejected = await rejectRoleRequest({
      requestId: request.id,
      approverNgoId: adminNgoId,
      approverState: request.state,
    });

    return rejected;
  },
};