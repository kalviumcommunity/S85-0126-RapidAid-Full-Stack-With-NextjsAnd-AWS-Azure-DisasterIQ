import { DisasterRepository } from "@/app/repositories/disaster.repo";

export const DisasterService = {
  create: async (payload: any) => {
    if (!payload.name || !payload.type) {
      throw { code: "VALIDATION_ERROR", message: "Name and type required" };
    }

    return DisasterRepository.create({
      name: payload.name,
      type: payload.type,
      severity: payload.severity ?? 1,
      location: payload.location ?? "Unknown",
      status: "ACTIVE",
    });
  },

  getAll: async () => {
    return DisasterRepository.findAll();
  },

  getById: async (id: string) => {
    const disaster = await DisasterRepository.findById(id);
    if (!disaster) {
      throw { code: "NOT_FOUND", message: "Disaster not found" };
    }
    return disaster;
  },

  update: async (id: string, payload: any) => {
    return DisasterRepository.update(id, payload);
  },

  partialUpdate: async (id: string, payload: any) => {
    return DisasterRepository.update(id, payload);
  },

  delete: async (id: string) => {
    return DisasterRepository.delete(id);
  },
};
