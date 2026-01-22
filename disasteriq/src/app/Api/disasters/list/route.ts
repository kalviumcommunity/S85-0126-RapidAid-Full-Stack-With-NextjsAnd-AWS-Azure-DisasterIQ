import { DisasterService } from "@/app/Service/disaster_service"

/**
 * @swagger
 * /api/disasters:
 *   get:
 *     summary: Get all disasters
 *     description: Fetches all disaster records from the system
 *     responses:
 *       200:
 *         description: A list of disasters
 */
export async function GET() {
  return Response.json(DisasterService.getAllDisasters())
}
