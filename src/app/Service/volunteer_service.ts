import bcrypt from "bcryptjs";
import { prisma } from "@/app/prisma/prisma";
import { VolunteerRepository } from "@/app/repositories/volunteer.repository";
import { generateAccessToken, generateRefreshToken } from "@/app/lib/jwt";

type VolunteerSignupInput = {
  name: string;
  email: string;
  password: string;
  ngoId: string;
  state: string;
  district?: string;
  address?: string;
  dob?: string;
  gender?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  skills?: string[];
  experienceYears?: number;
  certificationUrl?: string;
  canTravel?: boolean;
  hasVehicle?: boolean;
  rolePreference?: string;
};

type VolunteerLoginInput = {
  email: string;
  password: string;
};

export const VolunteerService = {
  signup: async (payload: VolunteerSignupInput) => {
    const { name, email, password, ngoId, state } = payload;

    if (!name || !email || !password || !ngoId || !state) {
      throw {
        code: "VALIDATION_ERROR",
        message: "name, email, password, ngoId, and state are required",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw {
        code: "VALIDATION_ERROR",
        message: "Email already registered",
      };
    }

    const ngo = await prisma.nGO.findUnique({
      where: { id: ngoId },
    });

    if (!ngo) {
      throw { code: "NOT_FOUND", message: "NGO not found" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        ngoId,
      },
    });

    const volunteer = await VolunteerRepository.create({
      userId: user.id,
      ngoId,
      state,
      district: payload.district,
      address: payload.address,
      dob: payload.dob ? new Date(payload.dob) : undefined,
      gender: payload.gender,
      emergencyContactName: payload.emergencyContactName,
      emergencyContactPhone: payload.emergencyContactPhone,
      skills: payload.skills,
      experienceYears: payload.experienceYears,
      certificationUrl: payload.certificationUrl,
      canTravel: payload.canTravel,
      hasVehicle: payload.hasVehicle,
      rolePreference: payload.rolePreference ?? null,
    });

    // ✅ ACCESS TOKEN
    const accessToken = generateAccessToken({
      userId: user.id,
      role: "VOLUNTEER",
      ngoId: ngo.id,
      state: volunteer.state,
    });

    // ✅ FIXED
    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      volunteer: {
        id: volunteer.id,
        state: volunteer.state,
        ngoId: volunteer.ngoId,
        verified: volunteer.verified,
        available: volunteer.available,
      },
    };
  },

  login: async (payload: VolunteerLoginInput) => {
    const { email, password } = payload;

    if (!email || !password) {
      throw {
        code: "VALIDATION_ERROR",
        message: "email and password are required",
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw { code: "UNAUTHORIZED", message: "Invalid credentials" };
    }

    const volunteer = await VolunteerRepository.findByUserId(user.id);

    if (!volunteer) {
      throw {
        code: "UNAUTHORIZED",
        message: "User is not a registered volunteer",
      };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw { code: "UNAUTHORIZED", message: "Invalid credentials" };
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: "VOLUNTEER",
      ngoId: volunteer.ngoId,
      state: volunteer.state,
    });

    // ✅ FIXED
    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      volunteer: {
        id: volunteer.id,
        state: volunteer.state,
        ngoId: volunteer.ngoId,
        verified: volunteer.verified,
        available: volunteer.available,
      },
    };
  },
};
