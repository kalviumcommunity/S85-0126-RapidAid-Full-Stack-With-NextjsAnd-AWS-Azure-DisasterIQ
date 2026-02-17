# 🌍 RapidAid – DisasterIQ  
### Full-Stack Disaster Management & Relief Coordination Platform  
Built with **Next.js + Prisma + AWS + Azure Cloud Services**

---

## 📌 Overview

**RapidAid (DisasterIQ)** is a full-stack disaster response and relief coordination platform designed to streamline communication between **Government Authorities, NGOs, and Volunteers** during emergency situations.

The platform enables:

- Disaster reporting and tracking  
- NGO onboarding and task assignment  
- Volunteer role-based participation  
- Secure cloud-based file uploads  
- Real-time dashboards for relief coordination  

RapidAid ensures disaster relief operations become faster, organized, and scalable through modern cloud-native architecture.

---

## 🚀 Key Features

### ✅ Role-Based Access Control (RBAC)
- Government users can create and manage disasters  
- NGOs can request approval and access relief tasks  
- Volunteers can register preferences and participate in missions  

---

### 🏛 Government Dashboard
- Create, update, delete disaster reports  
- Assign NGOs to active relief operations  
- Monitor disaster response progress  

---

### 🤝 NGO Workflow
- NGO signup with approval request system  
- Secure `/me` endpoint for authenticated NGO access  
- Task management and disaster assignment view  

---

### 🧑‍🤝‍🧑 Volunteer Participation
- Volunteers can publish role preferences  
- Admin/Government decides assignments  
- Improved onboarding flow for volunteers  

---

### ☁️ Cloud Integrations

#### AWS Services
- **AWS S3** for secure disaster image/document uploads  
- **AWS SES** for transactional email notifications  

#### Azure Services
- Azure-ready deployment structure for scalability  
- DisasterIQ designed for multi-cloud infrastructure  

---

### 🔐 Security Enhancements
- OWASP-compliant input sanitization  
- SQL Injection prevention via Prisma ORM  
- Secure headers + HTTPS enforcement  
- JWT authentication for protected routes  

---

### 🎨 UI/UX Improvements
- Modern responsive dashboard  
- Sidebar navigation + Coming Soon pages  
- Dark mode dropdown enhancements  
- Loading skeletons + error boundaries  

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16 (App Router + Turbopack)**
- React Hooks + Context API
- Tailwind CSS for styling
- Axios for API integration

### Backend
- Next.js API Routes
- Prisma ORM (PostgreSQL/MySQL compatible)
- JWT Authentication

### Database
- PostgreSQL (via Prisma)

### Cloud & DevOps
- AWS S3 (File Storage)
- AWS SES (Email Notifications)
- Azure Deployment Ready
- Secure Headers + HTTPS Enforcement

---

## 📂 Project Structure

```bash
RapidAid/
│── app/                 # Next.js App Router pages
│── components/          # Reusable UI components
│── context/             # Global state management
│── lib/                 # Utility functions & helpers
│── prisma/              # Prisma schema + migrations
│── public/              # Static assets
│── routes/api/          # API endpoints
│── middleware.ts        # Auth + RBAC middleware
│── .env.example         # Environment template
│── README.md            # Documentation
````

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rapidaid"

JWT_SECRET="your_secret_key"

AWS_ACCESS_KEY_ID="your_key"
AWS_SECRET_ACCESS_KEY="your_secret"
AWS_S3_BUCKET_NAME="bucket_name"

AWS_SES_EMAIL="verified_email"

NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/kalviumcommunity/S85-0126-RapidAid-Full-Stack-With-NextjsAnd-AWS-Azure-DisasterIQ.git
cd RapidAid
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Database

Run Prisma migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

---

### 4️⃣ Start Development Server

```bash
npm run dev
```

App will run on:

👉 Deployed Project Link---https://disaster-zeta.vercel.app/

---

## 📌 API Highlights

| Endpoint           | Role       | Description                     |
| ------------------ | ---------- | ------------------------------- |
| `/api/auth/signup` | Public     | Signup for all roles            |
| `/api/auth/login`  | Public     | Login with JWT                  |
| `/api/ngo/me`      | NGO        | Fetch authenticated NGO profile |
| `/api/disasters`   | Government | Manage disaster records         |
| `/api/tasks`       | NGO/Gov    | Relief task assignment system   |

---

## 📈 Recent Contributions & Enhancements

* NGO `/me` endpoint added
* Dashboard task fetching fixed
* NGO request routes implemented
* AWS SES email integration
* Secure HTTPS enforcement
* RBAC disaster creation restriction
* UI skeleton loaders + error boundaries

---

## 🌟 Future Improvements

* Real-time disaster alerts using WebSockets
* Live volunteer tracking system
* Analytics dashboard for disaster severity
* Mobile-first Progressive Web App (PWA)

---

## 👨‍💻 Contributors

* **Nishant** – Full-stack development, API integration, RBAC, Dashboard UI
* Team Members – NGO routing, Volunteer preference system, UI improvements

---

## 📜 License

This project is developed under Kalvium Community Program for educational and real-world full-stack training purposes.

---
