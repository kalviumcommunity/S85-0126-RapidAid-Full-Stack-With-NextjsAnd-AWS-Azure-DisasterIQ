import { prisma } from "@/app/prisma/prisma";
import { NGORequestStatus } from "@prisma/client";

type CreateNGORequestInput = {
  disasterId: string;
  ngoId: string;
  governmentId: string;
  requestedById: string;
};

const selectFields = {
  id: true,
  disasterId: true,
  ngoId: true,
  governmentId: true,
  status: true,
  requestedById: true,
  respondedAt: true,
  createdAt: true,
  disaster: {
    select: {
      id: true,
      name: true,
      type: true,
      severity: true,
      location: true,
      status: true,
      reportedAt: true,
    },
  },
  ngo: {
    select: {
      id: true,
      name: true,
      registrationNumber: true,
      state: true,
      focusArea: true,
    },
  },
  government: {
    select: {
      id: true,
      name: true,
      level: true,
      state: true,
      department: true,
    },
  },
  requestedBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

export const NGORequestRepository = {
  /**
   * Fetch all NGO requests with optional pagination
   */
  findAll: async (page = 1, pageSize = 10) => {
    const skip = (page - 1) * pageSize;
    
    const [data, total] = await Promise.all([
      prisma.nGORequest.findMany({
        select: selectFields,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.nGORequest.count(),
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  /**
   * Fetch NGO request by ID
   */
  findById: async (id: string) => {
    return prisma.nGORequest.findUnique({
      where: { id },
      select: selectFields,
    });
  },

  /**
   * Fetch all NGO requests for a specific disaster
   */
  findByDisasterId: async (disasterId: string, page = 1, pageSize = 10) => {
    const skip = (page - 1) * pageSize;
    
    const [data, total] = await Promise.all([
      prisma.nGORequest.findMany({
        where: { disasterId },
        select: selectFields,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.nGORequest.count({ where: { disasterId } }),
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  /**
   * Fetch all NGO requests for a specific NGO
   */
  findByNgoId: async (ngoId: string, page = 1, pageSize = 10) => {
    const skip = (page - 1) * pageSize;
    
    const [data, total] = await Promise.all([
      prisma.nGORequest.findMany({
        where: { ngoId },
        select: selectFields,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.nGORequest.count({ where: { ngoId } }),
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  /**
   * Fetch all NGO requests for a specific government
   */
  findByGovernmentId: async (governmentId: string, page = 1, pageSize = 10) => {
    const skip = (page - 1) * pageSize;
    
    const [data, total] = await Promise.all([
      prisma.nGORequest.findMany({
        where: { governmentId },
        select: selectFields,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.nGORequest.count({ where: { governmentId } }),
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  create: async (data: CreateNGORequestInput) => {
    return prisma.nGORequest.create({
      data: {
        disasterId: data.disasterId,
        ngoId: data.ngoId,
        governmentId: data.governmentId,
        requestedById: data.requestedById,
        status: NGORequestStatus.PENDING,
      },
    });
  },

  findExisting: async (disasterId: string, ngoId: string) => {
    return prisma.nGORequest.findUnique({
      where: {
        disasterId_ngoId: {
          disasterId,
          ngoId,
        },
      },
    });
  },

  /**
   * Update NGO request status (APPROVED or REJECTED)
   * Only updates if current status is PENDING
   */
  updateStatus: async (requestId: string, newStatus: "APPROVED" | "REJECTED") => {
    const statusMap: Record<string, NGORequestStatus> = {
      APPROVED: NGORequestStatus.ACCEPTED,
      REJECTED: NGORequestStatus.REJECTED,
    };

    const prismaStatus = statusMap[newStatus];
    if (!prismaStatus) {
      throw new Error("INVALID_STATUS");
    }

    return prisma.nGORequest.update({
      where: { id: requestId },
      data: {
        status: prismaStatus,
        respondedAt: new Date(),
      },
      select: selectFields,
    });
  },

  /**
   * Find request by requestedById and ngoId
   */
  findByRequestedByAndNgo: async (requestedById: string, ngoId: string) => {
    return prisma.nGORequest.findFirst({
      where: {
        requestedById,
        ngoId,
      },
      select: selectFields,
    });
  },
};
