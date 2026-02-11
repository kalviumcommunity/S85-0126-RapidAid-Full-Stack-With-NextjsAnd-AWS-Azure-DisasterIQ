import { prisma } from "@/app/prisma/prisma";

type CreateVolunteerInput = {
  userId: string;
  ngoId: string;
  state: string;
  district?: string;
  address?: string;
  dob?: Date;
  gender?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  skills?: string[];
  experienceYears?: number;
  certificationUrl?: string;
  canTravel?: boolean;
  hasVehicle?: boolean;
  rolePreference?: string | null;
};

export const VolunteerRepository = {
  create: async (data: CreateVolunteerInput) => {
    return prisma.volunteer.create({
      data: {
        userId: data.userId,
        ngoId: data.ngoId,
        state: data.state,
        district: data.district,
        address: data.address,
        dob: data.dob,
        gender: data.gender,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        skills: data.skills || [],
        experienceYears: data.experienceYears,
        certificationUrl: data.certificationUrl,
        canTravel: data.canTravel ?? false,
        hasVehicle: data.hasVehicle ?? false,
        rolePreference: data.rolePreference as any,
        verified: false,
        isActive: true,
        available: true,
      },
      include: {
        user: true,
        ngo: true,
      },
    });
  },

  findByUserId: async (userId: string) => {
    return prisma.volunteer.findUnique({
      where: { userId },
      include: {
        user: true,
        ngo: true,
      },
    });
  },

  findById: async (id: string) => {
    return prisma.volunteer.findUnique({
      where: { id },
      include: {
        user: true,
        ngo: true,
      },
    });
  },

  findByNgoId: async (ngoId: string) => {
    return prisma.volunteer.findMany({
      where: { ngoId },
      include: {
        user: true,
      },
    });
  },
};
