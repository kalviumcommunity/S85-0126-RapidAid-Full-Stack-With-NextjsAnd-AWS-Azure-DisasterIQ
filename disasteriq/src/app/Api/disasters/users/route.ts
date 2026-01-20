import { requireAuth } from "@/app/lib/authMiddleware";
import { sendSuccess } from "@/app/lib/ responseHandler";

export const GET = requireAuth(async (req: Request) => {
  const user = (req as any).user;
  return sendSuccess(user, "Protected user data");
});
