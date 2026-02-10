import { prisma } from "@/app/prisma/prisma";
import { RolePreferenceRequestStatus } from "@prisma/client";

export type CreateRolePreferenceRequestInput = {
  userId: string;
  ngoId: string;
  state: string;
  preferredRole: string;
};

export type ApproveRolePreferenceRequestInput = {
  requestId: string;
  approvedRole: string;
  approvedBy: string;
};

export const RolePreferenceRequestRepository = {
  create: async (data: CreateRolePreferenceRequestInput) => {
    return prisma.rolePreferenceRequest.create({
      data: {
        userId: data.userId,
        ngoId: data.ngoId,
        state: data.state,
        preferredRole: data.preferredRole,
        status: RolePreferenceRequestStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ngo: {
          select: {
            id: true,
            name: true,
            state: true,
          },
        },
      },
    });
  },

  /**
   * Find role preference requests for an NGO admin
   * Filters by ngoId and state to ensure admins only see their own requests
   */
  findByNgoAndState: async (ngoId: string, state: string, status?: RolePreferenceRequestStatus) => {
    const where: any = {
      ngoId,
      state,
    };

    if (status) {
      where.status = status;
    }

    return prisma.rolePreferenceRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        ngo: {
          select: {
            id: true,
            name: true,
            state: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Find pending role preference requests for an NGO admin
   */
  findPendingByNgoAndState: async (ngoId: string, state: string) => {
    return RolePreferenceRequestRepository.findByNgoAndState(
      ngoId,
      state,
      RolePreferenceRequestStatus.PENDING
    );
  },

  /**
   * Find a specific request by ID
   */
  findById: async (requestId: string) => {
    return prisma.rolePreferenceRequest.findUnique({
      where: { id: requestId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        ngo: {
          select: {
            id: true,
            name: true,
            state: true,
          },
        },
      },
    });
  },

  /**
   * Approve a role preference request
   * Only allows if the request's ngoId and state match the approver's ngoId and state
   */
  approve: async (data: ApproveRolePreferenceRequestInput, approverNgoId: string, approverState: string) => {
    // First, fetch the request to verify ownership
    const request = await prisma.rolePreferenceRequest.findUnique({
      where: { id: data.requestId },
    });

    if (!request) {
      throw new Error("Request not found");
    }

    // Verify the approver has permission to approve this request
    if (request.ngoId !== approverNgoId || request.state !== approverState) {
      throw new Error("Unauthorized: Request does not belong to your NGO or state");
    }

    if (request.status !== RolePreferenceRequestStatus.PENDING) {
      throw new Error("Request is not in PENDING status");
    }

    return prisma.rolePreferenceRequest.update({
      where: { id: data.requestId },
      data: {
        status: RolePreferenceRequestStatus.APPROVED,
        approvedRole: data.approvedRole,
        approvedBy: data.approvedBy,
        approvedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ngo: {
          select: {
            id: true,
            name: true,
            state: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  /**
   * Reject a role preference request
   */
  reject: async (requestId: string, approverNgoId: string, approverState: string) => {
    // Verify ownership
    const request = await prisma.rolePreferenceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error("Request not found");
    }

    if (request.ngoId !== approverNgoId || request.state !== approverState) {
      throw new Error("Unauthorized: Request does not belong to your NGO or state");
    }

    if (request.status !== RolePreferenceRequestStatus.PENDING) {
      throw new Error("Request is not in PENDING status");
    }

    return prisma.rolePreferenceRequest.update({
      where: { id: requestId },
      data: {
        status: RolePreferenceRequestStatus.REJECTED,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * Check if user has existing request for this NGO
   */
  findExisting: async (userId: string, ngoId: string) => {
    return prisma.rolePreferenceRequest.findUnique({
      where: {
        userId_ngoId: {
          userId,
          ngoId,
        },
      },
    });
  },
};


/**
 * Find a pending role preference request
 * scoped to NGO
 */
export async function findPendingRoleRequest(
  userId: string,
  ngoId: string
) {
  return prisma.rolePreferenceRequest.findFirst({
    where: {
      userId,
      ngoId,
      status: RolePreferenceRequestStatus.PENDING,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      ngo: {
        select: { id: true, name: true },
      },
    },
  });
}

/**
 * Approve role preference request
 */
export async function approveRoleRequest(params: {
  requestId: string;
  approvedBy: string;
  approvedRole: string;
}) {
  return prisma.rolePreferenceRequest.update({
    where: { id: params.requestId },
    data: {
      status: RolePreferenceRequestStatus.APPROVED,
      approvedRole: params.approvedRole,
      approvedAt: new Date(),
      approvedBy: params.approvedBy,
    },
  });
}

/**
 * Reject role preference request
 */
export async function rejectRoleRequest(params: {
  requestId: string;
  approverNgoId: string;
  approverState: string;
}) {
  // Verify ownership
  const request = await prisma.rolePreferenceRequest.findUnique({
    where: { id: params.requestId },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.ngoId !== params.approverNgoId || request.state !== params.approverState) {
    throw new Error("Unauthorized: Request does not belong to your NGO or state");
  }

  if (request.status !== RolePreferenceRequestStatus.PENDING) {
    throw new Error("Request is not in PENDING status");
  }

  return prisma.rolePreferenceRequest.update({
    where: { id: params.requestId },
    data: {
      status: RolePreferenceRequestStatus.REJECTED,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Create or update volunteer entry
 */
export async function upsertVolunteer(params: {
  userId: string;
  ngoId: string;
  role: string;
  state: string;
}) {
  return prisma.volunteer.upsert({
    where: {
      userId: params.userId, // ✅ UNIQUE
    },
    update: {
      role: params.role as any,
      verified: true,
      verifiedAt: new Date(),
    },
    create: {
      userId: params.userId,
      ngoId: params.ngoId,
      role: params.role as any,
      verified: true,
      verifiedAt: new Date(),
      state: params.state,
    },
  });
}