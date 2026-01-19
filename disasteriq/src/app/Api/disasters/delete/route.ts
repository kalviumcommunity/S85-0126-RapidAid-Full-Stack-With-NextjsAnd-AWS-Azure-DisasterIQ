import { DisasterService } from "@/app/Service/disaster_service"

export async function DELETE(req: Request) {
  const { id } = await req.json()

  const deleted = DisasterService.deleteDisaster(id)

  if (!deleted) {
    return Response.json({ error: "Disaster not found" }, { status: 404 })
  }

  return Response.json({ message: "Deleted", deleted })
}
