# 🌍 Disaster Relief Coordination Platform

## 📌 Project Overview

This project is a **Disaster Relief Coordination Platform** built using **Next.js** that helps NGOs and government agencies collaborate through **open APIs and real-time dashboards** during natural disasters such as floods, earthquakes, and cyclones.

The platform acts as a **central command system** where all relief-related data — food, shelters, rescue teams, and affected people — is collected, processed, and displayed in one place so decisions can be made quickly and accurately.

---

## ❓ Why We Are Building This

During disasters, relief operations often fail not because resources are unavailable, but because **information is scattered** across different NGOs and government departments.

### Common problems today:

* NGOs don’t know what other NGOs have supplied
* Government doesn’t know which shelters are full
* Rescue teams don’t know where help is needed most
* Decisions are made using outdated or incomplete data

### This results in:

* Wasted food and medicine
* Overcrowded shelters
* Delayed rescue operations

Our platform solves this by creating a **single real-time data hub** where:

* NGOs can upload what they are providing
* Government can monitor and coordinate
* Everyone sees the same live situation

This leads to **faster response, better planning, and more lives saved**.

---

## 🗂️ Project Structure

```
disasteriq/
├── .husky/
│   └── pre-commit
│
├── .next/
├── node_modules/
├── public/
│
├── src/
│   └── app/
│       ├── Api/
│       │   └── disasters/
│       │       ├── create/
│       │       │   └── route.ts
│       │       │
│       │       ├── delete/
│       │       │   └── route.ts
│       │       │
│       │       ├── list/
│       │       │   └── route.ts
│       │       │
│       │       ├── stats/
│       │       │   └── route.ts
│       │       │
│       │       └── update/
│       │           └── route.ts
│       │
│       ├── repositories/
│       │   └── disaster.repo.ts
│       │
│       ├── Service/
│       │   └── disaster.service.ts
│       │
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
│
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md

```

---

## 🚀 Future Scope

This platform can be expanded into a **national-level disaster management system**. In the future, it can support:

* 📍 GPS tracking of rescue teams and relief vehicles
* 🤖 AI-based prediction of shortages and high-risk areas
* 🌐 Integration with international relief organizations
* 📊 Advanced analytics for government planning and budgeting

With these additions, the system can become a **complete digital backbone for disaster response**.

---

## 👥 Team

| Name        | Role                                      |
| ----------- | ----------------------------------------- |
| **Pranav**  | System Design, Backend Architecture, APIs |
| **Nishant** | Frontend UI, Dashboard Design             |
| **Tanmay**  | Testing, DevOps, Documentation            |

---

This project represents our vision of how **technology, real-time data, and collaboration** can make disaster relief operations faster, smarter, and more effective.

