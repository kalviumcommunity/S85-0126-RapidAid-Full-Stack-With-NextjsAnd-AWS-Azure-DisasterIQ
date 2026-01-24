import { PrismaClient, MediaType } from "@prisma/client";
import { hashPassword } from "@/app/lib/password";

const prisma = new PrismaClient();

async function main() {
  // --------------------
  // ROLES
  // --------------------
  await prisma.role.createMany({
    data: [
      { name: "SUPER_ADMIN" },
      { name: "GOVERNMENT_ADMIN" },
      { name: "USER" },
      { name: "POLICE_ADMIN" },
      { name: "NGO_ADMIN" },
      { name: "HOSPITAL_ADMIN" },
    ],
    skipDuplicates: true,
  });

  const roles = await prisma.role.findMany();
  const getRoleId = (name: string) =>
    roles.find((r) => r.name === name)!.id;

  // --------------------
  // GOVERNMENT (unique: contactEmail)
  // --------------------
  const government = await prisma.government.upsert({
    where: { contactEmail: "dma@haryana.gov.in" },
    update: {},
    create: {
      name: "Disaster Management Authority",
      level: "STATE",
      state: "Haryana",
      department: "Disaster Response",
      contactEmail: "dma@haryana.gov.in",
      contactPhone: "9999999999",
    },
  });

  // --------------------
  // POLICE (unique: stationCode)
  // --------------------
  const police = await prisma.police.upsert({
    where: { stationCode: "AMB-PS-01" },
    update: {},
    create: {
      name: "Ambala Police Station",
      stationCode: "AMB-PS-01",
      state: "Haryana",
      district: "Ambala",
      address: "Sector 9, Ambala",
      officerInCharge: "Inspector Sharma",
      contactNumber: "8888888888",
    },
  });

  // --------------------
  // NGO (unique: registrationNumber)
  // --------------------
  const ngo = await prisma.nGO.upsert({
    where: { registrationNumber: "NGO-HR-2024-01" },
    update: {},
    create: {
      name: "Helping Hands NGO",
      registrationNumber: "NGO-HR-2024-01",
      state: "Haryana",
      district: "Ambala",
      focusArea: "Disaster Relief",
      contactEmail: "contact@helpinghands.org",
      contactPhone: "7777777777",
    },
  });

  // --------------------
  // HOSPITAL (NOT unique → findFirst + create)
  // --------------------
  let hospital = await prisma.hospital.findFirst({
    where: { contactNumber: "6666666666" },
  });

  if (!hospital) {
    hospital = await prisma.hospital.create({
      data: {
        name: "Civil Hospital Ambala",
        type: "GOVT",
        state: "Haryana",
        district: "Ambala",
        address: "GT Road, Ambala",
        totalBeds: 200,
        availableBeds: 120,
        emergencyBeds: 40,
        contactNumber: "6666666666",
      },
    });
  }

  // --------------------
  // USERS (unique: email)
  // --------------------
  const passwordHash = await hashPassword("password123");

  await prisma.user.upsert({
    where: { email: "admin@gov.in" },
    update: {},
    create: {
      name: "State Admin",
      email: "admin@gov.in",
      passwordHash,
      governmentId: government.id,
      roles: { create: { roleId: getRoleId("GOVERNMENT_ADMIN") } },
    },
  });

  await prisma.user.upsert({
    where: { email: "ngo@ngo.org" },
    update: {},
    create: {
      name: "NGO Coordinator",
      email: "ngo@ngo.org",
      passwordHash,
      ngoId: ngo.id,
      roles: { create: { roleId: getRoleId("NGO_ADMIN") } },
    },
  });

  await prisma.user.upsert({
    where: { email: "hospital@hospital.in" },
    update: {},
    create: {
      name: "Hospital Admin",
      email: "hospital@hospital.in",
      passwordHash,
      hospitalId: hospital.id,
      roles: { create: { roleId: getRoleId("HOSPITAL_ADMIN") } },
    },
  });

  await prisma.user.upsert({
    where: { email: "police@police.in" },
    update: {},
    create: {
      name: "Police Officer",
      email: "police@police.in",
      passwordHash,
      policeId: police.id,
      roles: { create: { roleId: getRoleId("POLICE_ADMIN") } },
    },
  });

  // --------------------
  // DISASTER (not unique → create)
  // --------------------
  const disaster = await prisma.disaster.create({
    data: {
      name: "Ambala Floods",
      type: "FLOOD",
      severity: 4,
      location: "Ambala District",
      status: "ACTIVE",
      governmentId: government.id,
    },
  });

  // --------------------
  // MEDIA (not unique → create)
  // --------------------
  await prisma.media.create({
    data: {
      type: MediaType.IMAGE,
      url: "https://example.com/flood.jpg",
      disasterId: disaster.id,
      uploadedByGovernmentId: government.id,
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
