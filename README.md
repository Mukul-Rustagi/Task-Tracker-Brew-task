# 📝 **Task Tracker**

A modern, full‑stack **task management application** built with **Next.js 16**, **TypeScript**, **MongoDB**, and **NextAuth.js**. Enjoy a clean interface, fast performance, and powerful productivity tools.

---

## 🌟 **Tech Badges**

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square\&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square\&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square\&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square\&logo=tailwind-css)

---

## ✨ **Features Overview**

### 🔐 **Authentication**

* Secure email/password login
* Google OAuth with NextAuth.js
* JWT‑based session management
* Middleware‑based protected routes

### 📋 **Task Management**

* Full CRUD operations
* Priority levels & statuses
* Due dates & categories
* Bulk actions
* Subtasks support
* Search & filtering

### 🎨 **User Interface**

* Modern, responsive design
* Light/Dark theme toggle
* Real-time UI updates
* Helpful error & loading states

### 📊 **Analytics & Insights**

* Productivity statistics
* Visual charts
* PDF export
* Calendar view

### 👤 **Profile Tools**

* Update profile info
* View personal task stats
* Manage account settings

---

## 🛠️ **Tech Stack**

### **Frontend**

* Next.js 16 (App Router, Turbopack)
* TypeScript
* Tailwind CSS
* Lucide Icons
* jsPDF for PDF reports

### **Backend**

* Next.js API Routes
* NextAuth.js Authentication
* MongoDB + Mongoose
* Zod validation
* bcryptjs hashing

### **Code Quality**

* ESLint
* Schema‑driven validations
* Scalable folder structure
* Reusable utilities

---

## 📁 **Project Structure**

```
task_tracker/
├── app/
│   ├── api/
│   ├── auth/
│   ├── dashboard/
│   ├── profile/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
├── contexts/
├── lib/
├── models/
├── types/
├── public/
├── .env.local
├── middleware.ts
├── next.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 **Getting Started**

### **Prerequisites**

* Node.js 18+
* MongoDB (local or Atlas)
* npm or yarn

### **Install & Run**

```bash
cd task_tracker
npm install
npm run dev
```

### **Environment Variables**

```env
MONGODB_URI=mongodb://localhost:27017/task-tracker
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 🧪 **Testing Checklist**

* [ ] Create account
* [ ] Sign in/out
* [ ] Google login
* [ ] Task CRUD
* [ ] Filters & search
* [ ] PDF export
* [ ] Profile update

---

## 🚢 **Deploying on Vercel**

* Push your repo to GitHub
* Import into Vercel
* Add environment variables
* Deploy with a single click

---

## 📱 **Screenshots**

* Dashboard overview
* Task creation modal
* Profile statistics page

*(Add screenshots here)*

---

## 🤝 **Contributing**

1. Fork repo
2. Create feature branch
3. Commit changes
4. Submit PR

---

## 📄 **License**

MIT License

---

## ❤️ **Author**

Built with passion using modern web technologies.

---

### ⭐ Enjoy the project? Give it a star and share the love!
