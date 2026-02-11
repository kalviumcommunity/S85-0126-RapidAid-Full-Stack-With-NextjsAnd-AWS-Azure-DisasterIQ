import { z } from "zod";

export const createDisasterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.string().min(3, "Type is required"),
  severity: z.number().int().min(1).max(10),
  location: z.string().min(3),
  status: z.enum(["REPORTED", "ONGOING", "RESOLVED"]),
});

export const updateDisasterSchema = createDisasterSchema.partial();

export const allocateResourceSchema = z.object({
  resourceId: z.string().uuid("resourceId must be a UUID"),
  disasterId: z.string().uuid("disasterId must be a UUID"),
  allocatedQuantity: z.number().int().positive(),
});
