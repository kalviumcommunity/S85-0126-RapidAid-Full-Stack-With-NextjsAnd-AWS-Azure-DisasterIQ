import bcrypt from "bcrypt";
import { AuthRepository } from "@/app/repositories/auth.repo";
import { signToken } from "@/app/lib/jwt";

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

    const token = signToken({
      id: user.id,
      email: user.email,
    });

    return { token, user };
  },
};
