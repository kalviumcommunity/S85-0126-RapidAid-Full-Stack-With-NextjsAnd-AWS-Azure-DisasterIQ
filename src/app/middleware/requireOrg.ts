import { NextRequest, NextResponse } from "next/server";

export function requireOrg(
  req: NextRequest,
  type: "ngo" | "hospital" | "police" | "government"
) {
  const headerMap = {
    ngo: "x-ngo-id",
    hospital: "x-hospital-id",
    police: "x-police-id",
    government: "x-government-id",
  };

  const orgId = req.headers.get(headerMap[type]);

  if (!orgId) {
    return NextResponse.json(
      { message: "Forbidden: organization access denied" },
      { status: 403 }
    );
  }

  return null; // ✅ allow
}
