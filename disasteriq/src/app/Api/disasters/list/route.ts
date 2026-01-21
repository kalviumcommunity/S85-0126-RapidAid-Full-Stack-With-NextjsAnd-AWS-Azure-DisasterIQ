import { DisasterService } from "@/app/Service/disaster_service"

export async function GET() {
  return Response.json(DisasterService.getAllDisasters())
}