import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

type JwtUserPayload = {
  userId: string;
  role: string;
  governmentId?: string | null;
  policeId?: string | null;
  ngoId?: string | null;
  hospitalId?: string | null;
};

export const generateAccessToken = (payload: JwtUserPayload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
      governmentId: payload.governmentId ?? null,
      policeId: payload.policeId ?? null,
      ngoId: payload.ngoId ?? null,
      hospitalId: payload.hospitalId ?? null,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (payload: { userId: string }) => {
  return jwt.sign(
    {
      userId: payload.userId,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};
