import { DisasterService } from "@/app/Service/disaster_service"

export async function POST(req: Request) {
  const body = await req.json()

  const result = DisasterService.createDisaster(
    body.title,
    body.location,
    body.severity
  )

  return Response.json(result)
}
