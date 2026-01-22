import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
console.log(ACCESS_TOKEN_SECRET);
console.log(REFRESH_TOKEN_SECRET);

type JwtUserPayload = {
  id: string;
  role: string;
};

export const generateAccessToken = (user: JwtUserPayload) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: Pick<JwtUserPayload, "id">) => {
  return jwt.sign(
    {
      userId: user.id,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};
