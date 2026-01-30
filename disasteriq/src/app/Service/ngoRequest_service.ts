
import { NGORequestRepository } from "@/app/repositories/ngoRequest";
import { prisma } from "@/app/prisma/prisma";

type CreateNGORequestServiceInput = {
  disasterId: string;
  ngoId: string;
  governmentId: string;
  userId: string;
};

export const NGORequestService = {
  createRequest: async ({
    disasterId,
    ngoId,
    governmentId,
    userId,
  }: CreateNGORequestServiceInput) => {
    // 1. Validate disaster belongs to this government
    const disaster = await prisma.disaster.findFirst({
      where: {
        id: disasterId,
        governmentId,
      },
    });

    if (!disaster) {
      throw new Error("Disaster not found or not owned by government");
    }

    // 2. Validate NGO exists
    const ngo = await prisma.nGO.findUnique({
      where: { id: ngoId },
    });

    if (!ngo) {
      throw new Error("NGO not found");
    }

    // 3. Prevent duplicate request
    const existing = await NGORequestRepository.findExisting(
      disasterId,
      ngoId
    );

    if (existing) {
      throw new Error("NGO already requested for this disaster");
    }

    // 4. Save request
    return NGORequestRepository.create({
      disasterId,
      ngoId,
      governmentId,
      requestedById: userId,
    });
  },
};
