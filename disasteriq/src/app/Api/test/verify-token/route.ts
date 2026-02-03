import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.token;
    const secret = body.secret || process.env.ACCESS_TOKEN_SECRET;

    if (!token) {
      return NextResponse.json(
        { error: "Token required" },
        { status: 400 }
      );
    }

    console.log("Attempting verification with secret length:", secret?.length);
    
    const decoded = jwt.verify(token, secret!) as any;
    
    return NextResponse.json({
      success: true,
      message: "Token verified successfully",
      payload: decoded,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        hint: "Token signature does not match the secret. Try regenerating the token by logging in again.",
      },
      { status: 401 }
    );
  }
}
