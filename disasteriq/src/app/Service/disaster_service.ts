import { DisasterRepository } from "@/app/repositories/disaster.repo";
import { prisma } from "@/app/prisma/prisma";

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

    // ✅ TRANSACTION: disaster + initial metrics + audit log (all-or-nothing)
    try {
      const createdByUserId: string | undefined = payload.createdByUserId;

      const result = await prisma.$transaction(async (tx) => {
        const disaster = await tx.disaster.create({
          data: {
            name: payload.name,
            type: payload.type,
            severity: payload.severity ?? 1,
            location: payload.location ?? "Unknown",
            status: payload.status ?? "REPORTED",
            governmentId: payload.governmentId,
          },
          include: {
            government: {
              select: { id: true, name: true },
            },
          },
        });

        // Initial metrics row for dashboard/stat queries
        await tx.disasterMetric.create({
          data: {
            disasterId: disaster.id,
            totalVictims: 0,
            rescuedVictims: 0,
            activeShelters: 0,
          },
        });

        // Audit log is optional (if userId is available)
        if (createdByUserId) {
          await tx.auditLog.create({
            data: {
              userId: createdByUserId,
              action: "DISASTER_CREATED",
              entity: "Disaster",
              entityId: disaster.id,
            },
          });
        }

        return disaster;
      });

      return result;
    } catch (error) {
      // Rollback happens automatically; this is for graceful error propagation
      console.error("Disaster create transaction failed. Rolling back.", error);
      throw {
        code: "DATABASE_FAILURE",
        message: "Failed to create disaster (transaction rolled back)",
        details: error,
      };
    }
  },

  // -------------------------
  // READ
  // -------------------------
  getAll: async (opts?: {
    page?: number;
    pageSize?: number;
    status?: "REPORTED" | "ONGOING" | "RESOLVED";
  }) => {
    const pageSize = Math.min(Math.max(opts?.pageSize ?? 20, 1), 100);
    const page = Math.max(opts?.page ?? 1, 1);
    const skip = (page - 1) * pageSize;

    return DisasterRepository.findAll({
      skip,
      take: pageSize,
      status: opts?.status,
    });
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
