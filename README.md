# 🌍 Disaster Relief Coordination Platform

## 📌 Project Overview

The **Disaster Relief Coordination Platform** is a **full-stack, API-driven system** built using **Next.js (App Router), Prisma ORM, and PostgreSQL**. It enables **NGOs, hospitals, police, and government agencies** to collaborate through **secure APIs, centralized error handling, and role-based dashboards** during natural disasters such as floods, earthquakes, and cyclones.

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

## 🔐 Authorization Middleware 

### Authentication vs Authorization

| Concept        | Purpose                             | Example                                    |
| -------------- | ----------------------------------- | ------------------------------------------ |
| Authentication | Verifies who the user is            | User logs in with email & password         |
| Authorization  | Determines what the user can access | Only POLICE_ADMIN can access police routes |

This assignment focuses on **authorization**, implemented using **JWT-based middleware, access & refresh token strategy, and RBAC**.

---

## 🔑 Secure JWT & Session Management 

The platform implements **secure session management** using **Access Tokens and Refresh Tokens**, following industry best practices to balance **security** and **user experience**.

### 🔐 Access Token vs Refresh Token

| Token Type    | Purpose                    | Expiry     | Storage Location        |
| ------------- | -------------------------- | ---------- | ----------------------- |
| Access Token  | Authorize API requests     | 15 minutes | In-memory (client side) |
| Refresh Token | Renew access token session | 7 days     | HTTP-only secure cookie |

---

## ❌ Centralized Error Handling Middleware 

The platform implements a **centralized error handling layer** to ensure consistent error responses, secure production behavior, and structured logging.

---

## 🔒 Security Best Practices

* JWT secrets stored in root `.env`
* Access & refresh token separation
* Refresh tokens stored in HTTP-only cookies
* Authorization enforced at API level
* Centralized error handling for safe failures
* Middleware reused across routes
* **Input sanitization applied on all write APIs**
* **Parameterized database queries via Prisma ORM**
* **Passwords never sanitized, only hashed**

---

## 🧼 Input Sanitization & OWASP Compliance 

This assignment focuses on protecting the application against **OWASP Top 10 vulnerabilities**, specifically **Cross-Site Scripting (XSS)** and **SQL Injection (SQLi)**.

### OWASP Threats Addressed

| Vulnerability | Risk                                  | Example Attack                     |
| ------------- | ------------------------------------- | ---------------------------------- |
| XSS           | Script execution in user-facing pages | `<script>alert('Hacked')</script>` |
| SQL Injection | Database manipulation                 | `' OR 1=1 --`                      |

### Sanitization Strategy

* All user-provided string inputs are sanitized at the API boundary
* No HTML tags or attributes are allowed
* Inputs are cleaned before database writes
* Passwords are excluded and only hashed

### SQL Injection Prevention

Prisma ORM uses parameterized queries internally, preventing SQL Injection even when malicious input is provided.

### Reflection

Centralized sanitization and ORM-level protections ensure consistent, scalable security aligned with OWASP standards.

---

## 👥 Team

| Name        | Responsibility                                                  |
| ----------- | --------------------------------------------------------------- |
| **Pranav**  | Backend Architecture, Database Design, Authorization & Security |
| **Nishant** | Frontend UI, Dashboards                                         |
| **Tanmay**  | Testing, DevOps, Documentation                                  |

---

This project demonstrates **secure backend architecture**, **role-based authorization**, **OWASP-compliant input handling**, and **defensive coding practices** using modern web technologies.