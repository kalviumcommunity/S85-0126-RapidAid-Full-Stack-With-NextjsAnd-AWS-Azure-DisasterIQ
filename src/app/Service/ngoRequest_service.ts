
import { 
  createNGORequest,
  getNGOTasks,
  updateTaskStatus,
  getGovernmentRequests,
  getAllNGOs,
  getNGOById,
} from "@/app/repositories/ngoRequest.repository";
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
    const existing = await prisma.nGORequest.findFirst({
      where: {
        disasterId,
        ngoId,
      },
    });

    if (existing) {
      throw new Error("NGO already requested for this disaster");
    }

    // 4. Save request
    return await createNGORequest({
      disasterId,
      ngoId,
      governmentId,
      requestedById: userId,
    });
  },

  // NGO gets their assigned tasks
  getNGOTasks: async (ngoId: string) => {
    return await getNGOTasks(ngoId);
  },

  // NGO responds to task (accept/reject)
  respondToTask: async (taskId: string, status: "ACCEPTED" | "REJECTED") => {
    return await updateTaskStatus(taskId, status as any);
  },

  // Government sees all their requests and NGO responses
  getGovernmentRequests: async (governmentId: string) => {
    return await getGovernmentRequests(governmentId);
  },

  // Get all NGOs for government to assign tasks
  getAllNGOs: async () => {
    return await getAllNGOs();
  },

  // Get specific NGO details
  getNGOById: async (ngoId: string) => {
    return await getNGOById(ngoId);
  },
};
