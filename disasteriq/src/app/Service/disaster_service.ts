import { DisasterRepository } from "@/app/repositories/disaster.repo";

export const DisasterService = {
  // -------------------------
  // CREATE
  // -------------------------
  create: async (payload: any) => {
    if (!payload.name || !payload.type) {
      throw {
        code: "VALIDATION_ERROR",
        message: "Name and type required",
      };
    }

    if (!payload.governmentId) {
      throw {
        code: "VALIDATION_ERROR",
        message: "Government ID missing for disaster creation",
      };
    }

    // ✅ PASS FLAT DATA (repository handles Prisma)
    return DisasterRepository.create({
      name: payload.name,
      type: payload.type,
      severity: payload.severity ?? 1,
      location: payload.location ?? "Unknown",
      status: payload.status ?? "REPORTED",

      governmentId: payload.governmentId, // ✅ FIXED
    });
  },

  // -------------------------
  // READ
  // -------------------------
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

  // -------------------------
  // UPDATE
  // -------------------------
  update: async (id: string, payload: any) => {
    return DisasterRepository.update(id, payload);
  },

  partialUpdate: async (id: string, payload: any) => {
    return DisasterRepository.update(id, payload);
  },

  // -------------------------
  // DELETE
  // -------------------------
  delete: async (id: string) => {
    return DisasterRepository.delete(id);
  },
};
