import { NGORequestRepository } from "@/app/repositories/ngoApprovalRequest";

export class NGORequestService {
  static async getApprovedDisastersForNgo(ngoId: string) {
    if (!ngoId) {
      throw new Error("NGO ID missing");
    }

    const requests =
      await NGORequestRepository.findApprovedDisastersByNgoId(ngoId);

    // return only disaster objects
    return requests.map((req) => req.disaster);
  }
}
