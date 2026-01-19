import { DisasterService } from "@/app/Service/disaster_service"

export async function PUT(req: Request) {
  const body = await req.json()

  const updated = DisasterService.updateDisaster(body.id, body)

  if (!updated) {
    return Response.json({ error: "Disaster not found" }, { status: 404 })
  }

  return Response.json(updated)
}
