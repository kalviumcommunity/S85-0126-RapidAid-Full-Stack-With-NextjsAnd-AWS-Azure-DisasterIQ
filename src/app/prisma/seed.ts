import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  /* =======================
     ROLES (CRITICAL)
  ======================== */
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: "NGO_ADMIN" },
      update: {},
      create: { name: "NGO_ADMIN" },
    }),
    prisma.role.upsert({
      where: { name: "GOVERNMENT_ADMIN" },
      update: {},
      create: { name: "GOVERNMENT_ADMIN" },
    }),
    prisma.role.upsert({
      where: { name: "HOSPITAL_ADMIN" },
      update: {},
      create: { name: "HOSPITAL_ADMIN" },
    }),
    prisma.role.upsert({
      where: { name: "POLICE_ADMIN" },
      update: {},
      create: { name: "POLICE_ADMIN" },
    }),
    prisma.role.upsert({
      where: { name: "PUBLIC" },
      update: {},
      create: { name: "PUBLIC" },
    }),
  ]);

  console.log("✅ Roles seeded");

  /* =======================
     GOVERNMENT
  ======================== */
  const government = await prisma.government.create({
    data: {
      name: "Haryana Disaster Management Authority",
      level: "STATE",
      state: "Haryana",
      district: "Ambala",
      department: "Disaster Management",
      contactEmail: "hdma@gov.in",
      contactPhone: "1800123456",
    },
  });

  /* =======================
     NGO
  ======================== */
  const ngo = await prisma.nGO.create({
    data: {
      name: "Helping Hands Foundation",
      registrationNumber: "NGO-HR-001",
      state: "Haryana",
      focusArea: "Disaster Relief",
      contactEmail: "contact@helpinghands.org",
      contactPhone: "9876543210",
    },
  });

  /* =======================
     HOSPITAL
  ======================== */
  await prisma.hospital.create({
    data: {
      name: "City Civil Hospital",
      type: "Government",
      state: "Haryana",
      district: "Ambala",
      address: "Model Town, Ambala",
      totalBeds: 300,
      availableBeds: 120,
      emergencyBeds: 50,
      contactNumber: "0171-123456",
    },
  });

  /* =======================
     POLICE
  ======================== */
  await prisma.police.create({
    data: {
      name: "Ambala City Police Station",
      stationCode: "AMB-PS-01",
      state: "Haryana",
      district: "Ambala",
      address: "Sector 9, Ambala",
      officerInCharge: "Inspector Rajesh Kumar",
      contactNumber: "100",
    },
  });

  /* =======================
     USERS
  ======================== */
  const ngoAdmin = await prisma.user.create({
    data: {
      name: "NGO Admin",
      email: "admin@helpinghands.org",
      passwordHash: "DUMMY_HASH", // replace later
      ngoId: ngo.id,
    },
  });

  const govAdmin = await prisma.user.create({
    data: {
      name: "Government Admin",
      email: "admin@gov.in",
      passwordHash: "DUMMY_HASH",
      governmentId: government.id,
    },
  });

  /* =======================
     USER ROLES
  ======================== */
  await prisma.userRole.createMany({
    data: [
      {
        userId: ngoAdmin.id,
        roleId: roles.find(r => r.name === "NGO_ADMIN")!.id,
      },
      {
        userId: govAdmin.id,
        roleId: roles.find(r => r.name === "GOVERNMENT_ADMIN")!.id,
      },
    ],
  });

  console.log("✅ Users & roles linked");
  console.log("🌱 Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
