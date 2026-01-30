import { prisma } from "@/app/prisma/prisma";
import { DisasterRepository } from "@/app/repositories/disaster.repo";

type GetAllDisastersParams = {
  page?: number;
  pageSize?: number;
  status?: "REPORTED" | "ONGOING" | "RESOLVED";
};

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
        message: "Government ID missing",
      };
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 🌪 Create Disaster
        const disaster = await tx.disaster.create({
          data: {
            name: payload.name,
            type: payload.type,
            severity: payload.severity ?? 1,
            location: payload.location ?? "Unknown",
            status: payload.status ?? "REPORTED",
            governmentId: payload.governmentId,
          },
        });

        // 📸 Save Media
        if (payload.media?.length) {
          await tx.media.createMany({
            data: payload.media.map((m: any) => ({
              url: m.url,
              type: m.type,
              disasterId: disaster.id,
              uploadedByGovernmentId: payload.governmentId,
            })),
          });
        }

        // 📊 Metrics
        await tx.disasterMetric.create({
          data: {
            disasterId: disaster.id,
            totalVictims: 0,
            rescuedVictims: 0,
            activeShelters: 0,
          },
        });

        // 🧾 Audit log
        if (payload.createdByUserId) {
          await tx.auditLog.create({
            data: {
              userId: payload.createdByUserId,
              action: "DISASTER_CREATED",
              entity: "Disaster",
              entityId: disaster.id,
            },
          });
        }

        return disaster;
      });

      return result;
    } catch (err) {
      console.error("Disaster transaction failed:", err);
      throw {
        code: "DATABASE_FAILURE",
        message: "Failed to create disaster",
      };
    }
  },

  // -------------------------
  // READ ALL (PAGINATED)
  // -------------------------
  getAll: async (params?: GetAllDisastersParams) => {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;

    return DisasterRepository.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      status: params?.status,
    });
  },

  // -------------------------
  // READ BY ID
  // -------------------------
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
