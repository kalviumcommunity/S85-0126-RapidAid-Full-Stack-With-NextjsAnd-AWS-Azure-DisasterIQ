import { prisma } from "@/app/prisma/prisma";
import { NGORequestStatus } from "@prisma/client";

export class NGORequestRepository {
  static async findApprovedDisastersByNgoId(ngoId: string) {
    return prisma.nGORequest.findMany({
      where: {
        ngoId,
        status: NGORequestStatus.ACCEPTED, // only APPROVED
      },
      include: {
        disaster: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
