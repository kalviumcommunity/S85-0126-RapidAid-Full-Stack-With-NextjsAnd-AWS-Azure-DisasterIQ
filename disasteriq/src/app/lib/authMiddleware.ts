import { verifyToken } from "@/app/lib/jwt";
import { sendError } from "@/app/lib/ responseHandler";

export const requireAuth = (handler: Function) => {
  return async (req: Request) => {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return sendError("Token missing", "UNAUTHORIZED", 401);
    }

    try {
      const decoded = verifyToken(token);
      (req as any).user = decoded;
      return handler(req);
    } catch {
      return sendError("Invalid or expired token", "UNAUTHORIZED", 403);
    }
  };
};
