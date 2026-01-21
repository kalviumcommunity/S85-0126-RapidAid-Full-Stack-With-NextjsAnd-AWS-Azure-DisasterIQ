# 🌍 Disaster Relief Coordination Platform

## 📌 Project Overview

The **Disaster Relief Coordination Platform** is a **full-stack, API-driven system** built using **Next.js (App Router), Prisma ORM, and PostgreSQL**. It enables **NGOs, hospitals, police, and government agencies** to collaborate through **secure APIs and role-based dashboards** during natural disasters such as floods, earthquakes, and cyclones.

The platform acts as a **central command and coordination layer** where all disaster-related data — organizations, users, roles, disasters, victims, shelters, rescue teams, hospitals, and resources — is stored in a **single normalized database** and accessed through **authorization-protected APIs**.

---

## ❓ Why This Platform Exists

During real-world disasters, relief operations often fail not because resources are unavailable, but because **information is fragmented** across multiple NGOs and government bodies.

### Problems Observed

* NGOs don’t know what other NGOs have supplied
* Government authorities don’t know which shelters are full
* Police and rescue teams lack real-time priority information
* Hospitals cannot efficiently report victim status
* Decisions are made using outdated or incomplete data

### Our Solution

This platform provides a **single source of truth** where:

* NGOs publish available resources
* Government monitors disaster severity and shelter capacity
* Police coordinate rescue operations
* Hospitals submit medical reports for victims
* Rescue teams receive priority-based assignments

This results in **faster response times, better coordination, and reduced duplication of effort**.

---

## 🗄️ Database Design (Prisma + PostgreSQL)

The database is designed using **Prisma ORM** with PostgreSQL and follows **Third Normal Form (3NF)** to eliminate redundancy and ensure data integrity.

### Core Entities

* **User / Role / UserRole** – Authentication and Role-Based Access Control (RBAC)
* **NGO / Hospital / Police / Government** – Organizational entities
* **Disaster / Victim** – Disaster events and affected individuals
* **RescueTeam / RescueAssignment** – Rescue coordination
* **Shelter** – Temporary housing with capacity tracking
* **Resource / ResourceAllocation** – Relief resource distribution
* **MedicalReport** – Hospital reports for victims
* **AuditLog** – Action tracking for accountability
* **DisasterMetric** – Aggregated metrics for dashboards

---

## 🔐 Authorization Middleware (Assignment Implementation)

### Authentication vs Authorization

| Concept        | Purpose                             | Example                                    |
| -------------- | ----------------------------------- | ------------------------------------------ |
| Authentication | Verifies who the user is            | User logs in with email & password         |
| Authorization  | Determines what the user can access | Only POLICE_ADMIN can access police routes |

This assignment focuses on **authorization**, implemented using **JWT-based middleware and RBAC**.

---

## 🧩 Role-Based Access Control (RBAC)

User permissions are managed using a **many-to-many RBAC model**:

* Users can have multiple roles
* Roles are stored centrally
* Permissions are enforced at the API level

Example roles:

* `SUPER_ADMIN`
* `GOVERNMENT_ADMIN`
* `POLICE_ADMIN`
* `NGO_ADMIN`
* `HOSPITAL_ADMIN`
* `USER`

---

## 🛡 Authorization Middleware Design

### Middleware Goals

* Validate JWT tokens
* Enforce role-based access rules
* Prevent unauthorized access
* Follow the **principle of least privilege**

### Flow Diagram

```
Client Request
   ↓
Authorization Header (Bearer JWT)
   ↓
Auth Middleware (JWT Verification)
   ↓
Role Check (RBAC)
   ↓
Protected API Route
```

---

## 🧠 Authorization Middleware Logic

* JWT is verified in `authMiddleware`
* Decoded user data is attached to the request
* `requireRole` checks role permissions
* Unauthorized requests are rejected early



## 🧪 Protected Route Examples

### Police-only Route

```
GET /api/&&&&&/police/
Role Required: POLICE_ADMIN
```


## 🔍 Testing Authorization

* Valid JWT + correct role → **Access allowed**
* Missing / invalid token → **401 Unauthorized**
* Valid token but wrong role → **403 Forbidden**

---

## 🔒 Security Best Practices

* JWT secrets stored in root `.env`
* Authorization enforced at API level
* Middleware reused across routes
* Easy role extensibility for future needs

---

## 🚀 Future Enhancements

* GPS tracking for rescue teams
* AI-based resource shortage prediction
* Advanced analytics dashboards

---

## 👥 Team

| Name        | Responsibility                                                  |
| ----------- | --------------------------------------------------------------- |
| **Pranav**  | Backend Architecture, Database Design, Authorization Middleware |
| **Nishant** | Frontend UI, Dashboards                                         |
| **Tanmay**  | Testing, DevOps, Documentation                                  |

---

This project demonstrates **secure backend architecture**, **role-based authorization**, and **real-world API protection strategies** using modern web technologies.
