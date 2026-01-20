import { AuthService } from "@/app/Service/auth_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { apiHandler } from "@/app/lib/ apiWrapper";

export const POST = apiHandler(async (req: Request) => {
  try {
    const body = await req.json();
    const user = await AuthService.signup(body);

    return sendSuccess(
      { id: user.id, email: user.email },
      "Signup successful",
      201
    );
  } catch (err: any) {
    return sendError(err.message, err.code, 400);
  }
});
