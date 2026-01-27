# 🌍 Disaster Relief Coordination Platform

## 📌 Project Overview

The **Disaster Relief Coordination Platform** is a **full-stack, API-driven system** built using **Next.js (App Router), Prisma ORM, and PostgreSQL**. It enables **NGOs, hospitals, police, and government agencies** to collaborate through **secure APIs, centralized error handling, and role-based dashboards** during natural disasters such as floods, earthquakes, and cyclones.

The platform acts as a **central command and coordination layer** where all disaster-related data — organizations, users, roles, disasters, victims, shelters, rescue teams, hospitals, and resources — is stored in a **single normalized database** and accessed through **authorization-protected APIs**.

---

## ☁️ AWS S3 File Upload Flow (Pre‑Signed URLs)

The platform supports **secure media uploads (images & videos)** for disaster reports using **AWS S3 with pre‑signed URLs**. This approach ensures scalability, security, and optimal performance by avoiding direct file uploads through the backend server.

---

### 🔁 Upload Flow Overview

1. **Client selects a file** (image/video) from the browser.
2. **Frontend requests a pre‑signed upload URL** from the backend.
3. **Backend validates file metadata** (type, size) and generates a **temporary pre‑signed S3 URL**.
4. **Client uploads the file directly to S3** using the signed URL.
5. **S3 stores the object** and returns a success response.
6. **Frontend extracts the public S3 object URL**.
7. **Disaster creation API is called**, storing media URLs in the database along with disaster data.

This ensures that:

* AWS credentials are never exposed to the client
* Large file uploads do not overload the backend
* Upload permissions are time‑bound and scoped

---

### 🧠 Why Pre‑Signed URLs?

| Benefit           | Explanation                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| 🔐 Security       | Upload permissions expire automatically and are limited to a single object |
| ⚡ Performance     | Files bypass backend servers and upload directly to S3                     |
| 📈 Scalability    | Backend handles only lightweight URL generation                            |
| 💰 Cost Efficient | Reduces server bandwidth usage                                             |

---

### 🛠 Backend: Pre‑Signed URL API

The backend exposes an API that:

* Authenticates the user (JWT + RBAC)
* Validates file type (image/video)
* Generates a pre‑signed URL using AWS SDK

**Responsibilities:**

* No file data passes through backend
* Only metadata validation + URL generation

---

### 🌐 Frontend: Direct S3 Upload

On the frontend:

* The user selects one or more files
* Each file is uploaded directly to S3 using the signed URL
* Upload progress is tracked per file
* Uploaded S3 URLs are collected

These URLs are later submitted as part of the disaster creation payload.

---

### 🗂 Media Storage Strategy

* **S3 Bucket:** `disasteriq`
* **Folder Structure:**

  ```
  uploads/
    ├── 1700000000000-image1.png
    ├── 1700000000001-video1.mp4
  ```
* Object keys are timestamp‑prefixed to avoid collisions

---

### 🔒 Security Controls Implemented

| Control                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| IAM Restricted User    | Only `PutObject` permission on specific bucket |
| Short URL Expiry       | Signed URLs expire in ~60 seconds              |
| CORS Policy            | Restricts uploads to trusted frontend origin   |
| File Type Validation   | Prevents malicious uploads                     |
| No Public Write Access | Bucket blocks public uploads                   |

---

### 🧾 Database Storage

Only **metadata** is stored in the database:

* File URL
* Media type (IMAGE / VIDEO)
* Linked disaster ID

Actual file content remains securely stored in S3.

---

### 📌 Key Takeaway

This upload architecture mirrors **production‑grade systems** used by platforms like Google Drive and Slack — combining **security, performance, and scalability** while keeping the backend lean.

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

| Concept        | Purpose                             | Example                                      |
| -------------- | ----------------------------------- | -------------------------------------------- |
| Authentication | Verifies who the user is            | User logs in with email & password           |
| Authorization  | Determines what the user can access | Only `POLICE_ADMIN` can access police routes |

This project focuses heavily on **authorization**, implemented using **JWT-based middleware, Role-Based Access Control (RBAC), and protected API routes**.

---

## 🔑 Secure JWT & Session Management

The platform implements **secure session management** using **Access Tokens and Refresh Tokens**, following industry best practices.

### 🔐 Access Token vs Refresh Token

| Token Type    | Purpose                | Expiry      | Storage Location        |
| ------------- | ---------------------- | ----------- | ----------------------- |
| Access Token  | Authorize API requests | ~15 minutes | In-memory (client side) |
| Refresh Token | Renew access token     | ~7 days     | HTTP-only secure cookie |

This design minimizes token exposure while maintaining a smooth user experience.

---

## ❌ Centralized Error Handling Middleware

A **centralized error handling layer** ensures:

* Consistent API error responses
* Safe production error messages
* Structured server-side logging
* Easier debugging and maintenance

---

## 🔒 Security Best Practices

* JWT secrets stored securely in environment variables
* Access & refresh token separation
* Refresh tokens stored in HTTP-only cookies
* Authorization enforced at API level
* Centralized error handling
* Middleware reused across routes
* **Input sanitization on all write APIs**
* **Parameterized database queries via Prisma ORM**
* **Passwords are never sanitized — only hashed**

---

## 🧼 Input Sanitization & OWASP Compliance

The platform is designed to defend against **OWASP Top 10 vulnerabilities**, especially **Cross-Site Scripting (XSS)** and **SQL Injection (SQLi)**.

### OWASP Threats Addressed

| Vulnerability | Risk                   | Example                            |
| ------------- | ---------------------- | ---------------------------------- |
| XSS           | Script execution in UI | `<script>alert('Hacked')</script>` |
| SQL Injection | Database manipulation  | `' OR 1=1 --`                      |

### Sanitization Strategy

* All user-provided string inputs are sanitized at the API boundary
* HTML tags and attributes are stripped
* Inputs are cleaned before database writes
* Passwords bypass sanitization and are only hashed

### SQL Injection Prevention

Prisma ORM uses **parameterized queries**, preventing SQL Injection by design.

### Reflection

Centralized sanitization combined with ORM-level protections ensures consistent, scalable, and secure data handling aligned with OWASP standards.

---

## 👥 Team

| Name              | Responsibility                                                  |
| ----------------- | --------------------------------------------------------------- |
| **Pranav Sharma** | Backend Architecture, Database Design, Authorization & Security |
| **Nishant**       | Frontend UI, Dashboards                                         |
| **Tanmay**        | Testing, DevOps, Documentation                                  |

---

This project demonstrates **secure backend architecture**, **role-based authorization**, **OWASP-compliant input handling**, and **defensive coding practices** using modern web technologies.
