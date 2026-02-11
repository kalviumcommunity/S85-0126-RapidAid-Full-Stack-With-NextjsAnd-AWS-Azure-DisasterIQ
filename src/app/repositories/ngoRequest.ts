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

const paginate = (page: number, pageSize: number) => ({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

export const NGORequestRepository = {
  /**
   * Fetch by PRIMARY KEY
   */
  findById: async (id: string) =>
    prisma.nGORequest.findUnique({
      where: { id },
      select: selectFields,
    }),

  /**
   * ADMIN – fetch all
   */
  findAll: async (page: number, pageSize: number) => {
    const [items, count] = await prisma.$transaction([
      prisma.nGORequest.findMany({
        ...paginate(page, pageSize),
        orderBy: { createdAt: "desc" },
        select: selectFields,
      }),
      prisma.nGORequest.count(),
    ]);

    return { items, count };
  },

  /**
   * NGO – fetch own requests
   */
  findByNgoId: async (ngoId: string, page: number, pageSize: number) => {
    const [items, count] = await prisma.$transaction([
      prisma.nGORequest.findMany({
        where: { ngoId },
        ...paginate(page, pageSize),
        orderBy: { createdAt: "desc" },
        select: selectFields,
      }),
      prisma.nGORequest.count({ where: { ngoId } }),
    ]);

    return { items, count };
  },

  /**
   * Disaster – fetch related requests
   */
  findByDisasterId: async (
    disasterId: string,
    page: number,
    pageSize: number
  ) => {
    const [items, count] = await prisma.$transaction([
      prisma.nGORequest.findMany({
        where: { disasterId },
        ...paginate(page, pageSize),
        orderBy: { createdAt: "desc" },
        select: selectFields,
      }),
      prisma.nGORequest.count({ where: { disasterId } }),
    ]);

    return { items, count };
  },

  /**
   * Government – fetch requests sent by government
   */
  findByGovernmentId: async (
    governmentId: string,
    page: number,
    pageSize: number
  ) => {
    const [items, count] = await prisma.$transaction([
      prisma.nGORequest.findMany({
        where: { governmentId },
        ...paginate(page, pageSize),
        orderBy: { createdAt: "desc" },
        select: selectFields,
      }),
      prisma.nGORequest.count({ where: { governmentId } }),
    ]);

    return { items, count };
  },

  /**
   * Create request
   */
  create: async (data: {
    disasterId: string;
    ngoId: string;
    governmentId: string;
    requestedById: string;
  }) =>
    prisma.nGORequest.create({
      data: {
        ...data,
        status: NGORequestStatus.PENDING,
      },
      select: selectFields,
    }),

  /**
   * Update status
   */
  updateStatus: async (
    requestId: string,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    const statusMap = {
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
