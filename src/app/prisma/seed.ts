import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    "ADMIN",
    "POLICE_ADMIN",
    "HOSPITAL_ADMIN",
    "GOVERNMENT_ADMIN",
    "NGO_ADMIN",
    "CITIZEN",
    "PUBLIC"
  ];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    });
  }

  console.log("All roles seeded successfully ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
