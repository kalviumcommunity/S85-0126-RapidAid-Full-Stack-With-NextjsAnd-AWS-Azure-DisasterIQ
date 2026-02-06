import { prisma } from "@/app/prisma/prisma";
import { NGORequestStatus } from "@prisma/client";

export async function createNGORequest(data: {
  disasterId: string;
  ngoId: string;
  governmentId: string;
  requestedById: string;
}) {
  return await prisma.nGORequest.create({
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
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getNGOTasks(ngoId: string) {
  return await prisma.nGORequest.findMany({
    where: { ngoId },
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
    orderBy: { createdAt: "desc" },
  });
}

export async function updateTaskStatus(taskId: string, status: NGORequestStatus) {
  return await prisma.nGORequest.update({
    where: { id: taskId },
    data: { 
      status,
      respondedAt: new Date(),
    },
    include: {
      disaster: true,
      ngo: true,
      government: true,
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

export async function getGovernmentRequests(governmentId: string) {
  return await prisma.nGORequest.findMany({
    where: { governmentId },
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
    orderBy: { createdAt: "desc" },
  });
}

export async function getNGOById(ngoId: string) {
  return await prisma.nGO.findUnique({
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
  return await prisma.nGO.findMany({
    select: {
      id: true,
      name: true,
      state: true,
      focusArea: true,
      contactEmail: true,
      contactPhone: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
