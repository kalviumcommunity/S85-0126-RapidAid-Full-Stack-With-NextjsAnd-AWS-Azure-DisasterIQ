# 🌍 Disaster Relief Coordination Platform

## 📌 Project Overview

This project is a **Disaster Relief Coordination Platform** built using **Next.js + Prisma + PostgreSQL**. It enables NGOs, hospitals, and government agencies to collaborate through **APIs and real-time dashboards** during natural disasters such as floods, earthquakes, and cyclones.

The platform acts as a **central command system** where all relief-related data — organizations, users, roles, disasters, victims, shelters, rescue teams, hospitals, and resources — is stored in a **single normalized database** and exposed through APIs for coordination and decision-making.

---

## ❓ Why We Are Building This

During disasters, relief operations often fail not because resources are unavailable, but because **information is scattered** across different NGOs and government departments.

### Problems today

* NGOs don’t know what other NGOs have supplied
* Government doesn’t know which shelters are full
* Rescue teams don’t know where help is needed most
* Decisions are made using outdated or incomplete data

### Our solution

This platform creates a **single source of truth** where:

* NGOs upload available resources
* Government monitors disaster severity and shelter capacity
* Hospitals submit medical reports for victims
* Rescue teams receive assignments based on priority

This results in **faster response, better planning, and fewer resource conflicts**.

---

## 🗄️ Database Design (Prisma + PostgreSQL)

The database is designed using **Prisma ORM** with PostgreSQL and follows **proper normalization (3NF)** to avoid redundancy.

### Key Entities

* **Organization** – NGOs, Hospitals, Government bodies
* **User / Role / UserRole** – Authentication and RBAC (Many-to-Many)
* **Disaster / Victim** – Disaster events and affected people
* **RescueTeam / RescueAssignment** – Rescue operations
* **Shelter** – Temporary housing with capacity tracking
* **Resource / ResourceAllocation** – Relief resource distribution
* **Hospital / MedicalReport** – Medical tracking
* **AuditLog** – Action tracking for accountability
* **DisasterMetric** – Aggregated metrics for dashboards

### Keys, Constraints & Relationships

* UUIDs are used as **primary keys** for scalability and distributed systems
* Foreign keys enforce **referential integrity**
* Many-to-Many relationships are handled using junction tables (`UserRole`)
* Cascading deletes are applied where data must not exist independently (e.g., Victims → Disaster)
* Indexes are added on frequently queried fields such as `Disaster.status`

---

## 🔄 Database Migrations

Database migrations ensure that **every developer and environment** uses the same schema.

### Initial Migration

```bash
npx prisma migrate dev --name init_schema
```

This command:

* Generates SQL migration files in `prisma/migrations/`
* Creates all tables and relations in PostgreSQL
* Syncs Prisma Client with the schema

### Updating Schema

Whenever models are added or modified:

```bash
npx prisma migrate dev --name add_<feature_name>
```

Each migration is **versioned and reproducible**, making teamwork and deployments safe.

### Resetting Database (Development Only)

```bash
npx prisma migrate reset
```

* Drops the database
* Re-applies all migrations
* Re-runs seed scripts

⚠️ **Never run this in production**

---

## 🌱 Seed Scripts

Seed scripts insert **initial and test data** so the system is usable immediately.

### Seed File Location

```
prisma/seed.ts
```

### What We Seed

* Roles (ADMIN, NGO, HOSPITAL, GOVT)
* Sample Organizations
* Sample Users linked to organizations
* Initial Disaster record for testing

### Run Seed

```bash
npx prisma db seed
```

The seed script is written to be **idempotent**, ensuring data is not duplicated on re-run.

---

## 🔍 Verifying Data

Use Prisma Studio to visually inspect tables and relations:

```bash
npx prisma studio
```

This helps verify:

* Migrations ran successfully
* Seed data exists
* Relationships are correctly linked

---

## 🔐 Production Safety Practices

To protect production data:

* Migrations are tested in **local and staging** first
* Database backups are taken before schema changes
* `migrate reset` is restricted to development only
* Seed scripts are **never executed automatically in production**

---

## 🗂️ Project Structure

```
disasteriq/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   └── app/
│       ├── Api/
│       ├── repositories/
│       ├── Service/
│       └── page.tsx
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Future Scope

* 📍 GPS tracking of rescue teams
* 🤖 AI-based shortage prediction
* 🌐 Integration with international relief agencies
* 📊 Advanced analytics dashboards

---

## 👥 Team

| Name        | Role                                      |
| ----------- | ----------------------------------------- |
| **Pranav**  | System Design, Backend Architecture, APIs |
| **Nishant** | Frontend UI, Dashboard Design             |
| **Tanmay**  | Testing, DevOps, Documentation            |

---

This project demonstrates how **structured database design, migrations, and seed scripts** enable scalable and reliable disaster-management systems.