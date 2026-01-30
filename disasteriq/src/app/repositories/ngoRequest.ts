import { prisma } from "@/app/prisma/prisma";
import { NGORequestStatus } from "@prisma/client";

type CreateNGORequestInput = {
  disasterId: string;
  ngoId: string;
  governmentId: string;
  requestedById: string;
};

export const NGORequestRepository = {
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
};
