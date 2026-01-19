const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  /* =====================
     ROLES
  ===================== */
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" }
  });

  const ngoRole = await prisma.role.upsert({
    where: { name: "NGO" },
    update: {},
    create: { name: "NGO" }
  });

  const hospitalRole = await prisma.role.upsert({
    where: { name: "HOSPITAL" },
    update: {},
    create: { name: "HOSPITAL" }
  });

  /* =====================
     ORGANIZATIONS
  ===================== */
  let ngoOrg = await prisma.organization.findFirst({
    where: { name: "Helping Hands NGO" }
  });

  if (!ngoOrg) {
    ngoOrg = await prisma.organization.create({
      data: {
        name: "Helping Hands NGO",
        type: "NGO"
      }
    });
  }

  let hospitalOrg = await prisma.organization.findFirst({
    where: { name: "City Care Hospital" }
  });

  if (!hospitalOrg) {
    hospitalOrg = await prisma.organization.create({
      data: {
        name: "City Care Hospital",
        type: "HOSPITAL"
      }
    });
  }

  let govtOrg = await prisma.organization.findFirst({
    where: { name: "Disaster Management Authority" }
  });

  if (!govtOrg) {
    govtOrg = await prisma.organization.create({
      data: {
        name: "Disaster Management Authority",
        type: "GOVT"
      }
    });
  }

  /* =====================
     USERS
  ===================== */
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@disasteriq.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@disasteriq.com",
      passwordHash: "hashed_password_admin",
      organizationId: govtOrg.id
    }
  });

  const ngoUser = await prisma.user.upsert({
    where: { email: "ngo@helpinghands.org" },
    update: {},
    create: {
      name: "NGO Coordinator",
      email: "ngo@helpinghands.org",
      passwordHash: "hashed_password_ngo",
      organizationId: ngoOrg.id
    }
  });

  const hospitalUser = await prisma.user.upsert({
    where: { email: "doctor@citycare.com" },
    update: {},
    create: {
      name: "Hospital Doctor",
      email: "doctor@citycare.com",
      passwordHash: "hashed_password_hospital",
      organizationId: hospitalOrg.id
    }
  });

  /* =====================
     USER ROLES (RBAC)
  ===================== */
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id
    }
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: ngoUser.id,
        roleId: ngoRole.id
      }
    },
    update: {},
    create: {
      userId: ngoUser.id,
      roleId: ngoRole.id
    }
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: hospitalUser.id,
        roleId: hospitalRole.id
      }
    },
    update: {},
    create: {
      userId: hospitalUser.id,
      roleId: hospitalRole.id
    }
  });

  /* =====================
     DISASTER
  ===================== */
  let disaster = await prisma.disaster.findFirst({
    where: { name: "Floods in Assam" }
  });

  if (!disaster) {
    disaster = await prisma.disaster.create({
      data: {
        name: "Floods in Assam",
        type: "FLOOD",
        severity: 4,
        location: "Assam, India",
        status: "ACTIVE"
      }
    });
  }

  console.log("✅ Seed data inserted successfully");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
