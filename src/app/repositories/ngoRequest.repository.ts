import { prisma } from "@/app/prisma/prisma";
import { NGORequestStatus } from "@prisma/client";

/**
 * Create NGO request (Government → NGO)
 */
export async function createNGORequest(data: {
  disasterId: string;
  ngoId: string;
  governmentId: string;
  requestedById: string;
}) {
  return prisma.nGORequest.create({
    data: {
      disasterId: data.disasterId,
      ngoId: data.ngoId,
      governmentId: data.governmentId,
      requestedById: data.requestedById,
      status: NGORequestStatus.PENDING,
    },
    include: {
      disaster: true,
      ngo: true,
      government: true,
      requestedBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

/**
 * Get all tasks for NGO (used in NGO dashboard)
 */
export async function getNGOTasks(ngoId: string) {
  return prisma.nGORequest.findMany({
    where: { ngoId },
    orderBy: { createdAt: "desc" },
    include: {
      disaster: true,
      government: {
        select: {
          id: true,
          name: true,
          state: true,
        },
      },
      requestedBy: {
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
 * ✅ UPDATE NGO REQUEST STATUS (SAFE)
 * Only called with PRIMARY KEY (requestId)
 */
export async function updateTaskStatus(
  requestId: string,
  status: "APPROVED" | "REJECTED"
) {
  const statusMap: Record<"APPROVED" | "REJECTED", NGORequestStatus> = {
    APPROVED: NGORequestStatus.ACCEPTED,
    REJECTED: NGORequestStatus.REJECTED,
  };

  return prisma.nGORequest.update({
    where: { id: requestId },
    data: {
      status: statusMap[status],
      respondedAt: new Date(),
    },
    include: {
      disaster: true,
      ngo: true,
      government: true,
      requestedBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

/**
 * Get all requests created by a government
 */
export async function getGovernmentRequests(governmentId: string) {
  return prisma.nGORequest.findMany({
    where: { governmentId },
    orderBy: { createdAt: "desc" },
    include: {
      disaster: true,
      ngo: {
        select: {
          id: true,
          name: true,
          state: true,
          contactEmail: true,
        },
      },
      requestedBy: {
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
 * NGO helpers
 */
export async function getNGOById(ngoId: string) {
  return prisma.nGO.findUnique({
    where: { id: ngoId },
    select: {
      id: true,
      name: true,
      state: true,
      contactEmail: true,
      contactPhone: true,
    },
  });
}

export async function getAllNGOs() {
  return prisma.nGO.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      state: true,
      focusArea: true,
      contactEmail: true,
      contactPhone: true,
      createdAt: true,
    },
  });
}

