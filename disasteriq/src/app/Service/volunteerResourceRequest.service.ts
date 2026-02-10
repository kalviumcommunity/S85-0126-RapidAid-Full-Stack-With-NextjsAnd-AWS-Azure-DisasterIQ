import { VolunteerResourceRequestRepository } from "@/app/repositories/volunteerResourceRequest.repository";

export class VolunteerResourceRequestService {
  static async createRequest({
    ngoId,
    userId,
    disasterId,
    resourceType,
    quantity,
    unit,
  }: {
    ngoId: string;
    userId: string;
    disasterId?: string;
    resourceType: string;
    quantity: number;
    unit: string;
  }) {
    return VolunteerResourceRequestRepository.create({
      ngoId,
      requestedById: userId,
      disasterId,
      resourceType,
      quantity,
      unit,
    });
  }
}
