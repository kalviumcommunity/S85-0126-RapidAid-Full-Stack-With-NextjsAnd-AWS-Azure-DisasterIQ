import bcrypt from "bcrypt";
import { AuthRepository } from "@/app/repositories/auth.repo";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/app/lib/jwt";

export const AuthService = {
  signup: async (payload: any) => {
    const { name, email, password } = payload;

    if (!name || !email || !password) {
      throw { code: "VALIDATION_ERROR", message: "All fields required" };
    }

    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      throw { code: "VALIDATION_ERROR", message: "User already exists" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await AuthRepository.createUser({
      name,
      email,
      passwordHash,
    });

    return user;
  },

  login: async (payload: any) => {
    const { email, password } = payload;

    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      throw { code: "NOT_FOUND", message: "User not found" };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw { code: "UNAUTHORIZED", message: "Invalid credentials" };
    }

    // ✅ Extract role correctly from RBAC tables
    const primaryRole = user.roles[0]?.role.name ?? "CITIZEN";

    const accessToken = generateAccessToken({
      userId: user.id,
      role: primaryRole,

      governmentId: user.governmentId ?? null,
      policeId: user.policeId ?? null,
      ngoId: user.ngoId ?? null,
      hospitalId: user.hospitalId ?? null,

      governmentState: user.government?.state ?? null,
      state: user.state ?? null,
    });

    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user,
    };
  },
};
