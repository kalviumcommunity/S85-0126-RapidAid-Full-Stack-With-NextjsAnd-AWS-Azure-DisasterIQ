import type { NextRequest } from "next/server";
import { DisasterService } from "@/app/Service/disaster_service";
import { sendSuccess } from "@/app/lib/ responseHandler";
import { apiHandler } from "@/app/lib/ apiWrapper";

export const GET = apiHandler(async (req: NextRequest & { user?: any }) => {
  const { searchParams } = req.nextUrl;

  const id = searchParams.get("id");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const status = searchParams.get("status") as
    | "REPORTED"
    | "ONGOING"
    | "RESOLVED"
    | null;

  if (id) {
    const disaster = await DisasterService.getById(id);
    return sendSuccess(disaster, "Disaster fetched");
  }

  const disasters = await DisasterService.getAll({
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    status: status ?? undefined,
  });

  return sendSuccess(disasters, "Disasters fetched");
});
