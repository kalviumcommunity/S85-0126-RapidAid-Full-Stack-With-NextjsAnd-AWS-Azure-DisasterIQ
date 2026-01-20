import { AuthService } from "@/app/Service/auth_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";;
import { apiHandler } from "@/app/lib/ apiWrapper";


export const POST = apiHandler(async (req: Request) => {
  try {
    const body = await req.json();
    const { token, user } = await AuthService.login(body);

    return sendSuccess(
      {
        token,
        user: { id: user.id, email: user.email },
      },
      "Login successful"
    );
  } catch (err: any) {
    return sendError(err.message, err.code, 401);
  }
});
