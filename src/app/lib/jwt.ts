import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export type JwtUserPayload = {
  userId: string;
  role: string;
  governmentId?: string | null;
  policeId?: string | null;
  ngoId?: string | null;
  hospitalId?: string | null;
  governmentState?: string | null;
  state?: string | null;
};

export const generateAccessToken = (payload: JwtUserPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken  = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtUserPayload;
  } catch {
    return null;
  }
};
