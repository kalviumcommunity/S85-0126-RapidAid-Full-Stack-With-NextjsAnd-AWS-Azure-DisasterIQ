import { prisma } from "@/app/prisma/prisma";
import { NGORequestStatus } from "@prisma/client";

/**
 * Common select fields
 */
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
   * Fetch NGO request by PRIMARY KEY
   */
  findById: async (id: string) => {
    return prisma.nGORequest.findUnique({
      where: { id },
      select: selectFields,
    });
  },

  /**
   * Fetch all requests for an NGO
   */
  findByNgoId: async (ngoId: string) => {
    return prisma.nGORequest.findMany({
      where: { ngoId },
      select: selectFields,
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Create new NGO request
   */
  create: async (data: {
    disasterId: string;
    ngoId: string;
    governmentId: string;
    requestedById: string;
  }) => {
    return prisma.nGORequest.create({
      data: {
        disasterId: data.disasterId,
        ngoId: data.ngoId,
        governmentId: data.governmentId,
        requestedById: data.requestedById,
        status: NGORequestStatus.PENDING,
      },
      select: selectFields,
    });
  },

  /**
   * Update NGO request status
   * APPROVED -> ACCEPTED
   * REJECTED -> REJECTED
   */
  updateStatus: async (
    requestId: string,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    const statusMap: Record<"APPROVED" | "REJECTED", NGORequestStatus> = {
      APPROVED: NGORequestStatus.ACCEPTED,
      REJECTED: NGORequestStatus.REJECTED,
    };

    return prisma.nGORequest.update({
      where: { id: requestId },
      data: {
        status: statusMap[newStatus],
        respondedAt: new Date(),
      },
      select: selectFields,
    });
  },
};


