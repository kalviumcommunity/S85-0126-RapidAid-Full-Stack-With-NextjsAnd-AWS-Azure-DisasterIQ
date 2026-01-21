const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


async function main() {
  const roles = [
    "USER",
    "NGO_ADMIN",
    "HOSPITAL_ADMIN",
    "POLICE_ADMIN",
    "GOVERNMENT_ADMIN",
    "SUPER_ADMIN"
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role }
    });
  }

  console.log("✅ Roles seeded");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
