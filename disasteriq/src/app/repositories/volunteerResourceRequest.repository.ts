import { prisma } from "@/app/prisma/prisma";
import { VolunteerRole } from "@prisma/client";

interface CreateVolunteerResourceRequestInput {
  ngoId: string;
  requestedById: string;
  disasterId?: string;
  resourceType: string;
  quantity: number;
  unit: string;
}

export class VolunteerResourceRequestRepository {
  static async create(data: CreateVolunteerResourceRequestInput) {
    return prisma.volunteerResourceRequest.create({
      data: {
        ngoId: data.ngoId,
        requestedById: data.requestedById,
        disasterId: data.disasterId,
        resourceType: data.resourceType,
        quantity: data.quantity,
        unit: data.unit,
        requiredRole: VolunteerRole.GROUND_VOLUNTEER,
      },
    });
  }
}
