import { prisma } from "@/app/prisma/prisma";

export class InsufficientResourceError extends Error {
  code = "INSUFFICIENT_RESOURCE" as const;
  constructor(message = "Insufficient resource quantity") {
    super(message);
  }
}

export const ResourceAllocationService = {
  /**
   * Transaction scenario:
   * - Create allocation record
   * - Decrement resource quantity
   * - Write audit log
   *
   * All 3 must succeed together or the transaction rolls back.
   */
  allocateToDisaster: async (payload: {
    resourceId: string;
    disasterId: string;
    allocatedQuantity: number;
    performedByUserId?: string;
  }) => {
    const { resourceId, disasterId, allocatedQuantity, performedByUserId } =
      payload;

    if (!resourceId || !disasterId) {
      throw { code: "VALIDATION_ERROR", message: "resourceId and disasterId are required" };
    }
    if (!Number.isInteger(allocatedQuantity) || allocatedQuantity <= 0) {
      throw {
        code: "VALIDATION_ERROR",
        message: "allocatedQuantity must be a positive integer",
      };
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Lock resource row for update by doing the update later inside tx;
        // first check current quantity
        const resource = await tx.resource.findUnique({
          where: { id: resourceId },
          select: { id: true, quantity: true, type: true, unit: true },
        });

        if (!resource) {
          throw { code: "NOT_FOUND", message: "Resource not found" };
        }

        if (resource.quantity < allocatedQuantity) {
          throw new InsufficientResourceError(
            `Requested ${allocatedQuantity}, available ${resource.quantity}`
          );
        }

        const allocation = await tx.resourceAllocation.create({
          data: {
            resourceId,
            disasterId,
            allocatedQuantity,
          },
        });

        const updatedResource = await tx.resource.update({
          where: { id: resourceId },
          data: { quantity: { decrement: allocatedQuantity } },
          select: { id: true, quantity: true, type: true, unit: true },
        });

        if (performedByUserId) {
          await tx.auditLog.create({
            data: {
              userId: performedByUserId,
              action: "RESOURCE_ALLOCATED",
              entity: "ResourceAllocation",
              entityId: allocation.id,
            },
          });
        }

        return { allocation, updatedResource };
      });

      return result;
    } catch (error) {
      console.error("Resource allocation transaction failed. Rolling back.", error);
      throw error;
    }
  },
};

