# ProjectHub 🚀

A full-stack **Task Management System** built with **ASP.NET Core** (backend) and **Angular** (frontend). Manage tasks, assign users, track comments, and control role-based access — all in one place.

---

## 📸 Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Frontend  | Angular 17+            |
| Backend   | ASP.NET Core Web API   |
| Database  | SQL Server (EF Core)   |
| Auth      | JWT Authentication      |

---

## 📁 Project Structure

```
PROJECTHUB/
├── BACKEND/
│   └── ProjectHubAPI/        # ASP.NET Core Web API
│       ├── Controllers/       # API Endpoints (Auth, Task, User, Role)
│       ├── Models/            # Entity Models
│       ├── DTOs/              # Data Transfer Objects
│       ├── Services/          # Business Logic
│       └── Data/              # DB Context & Seeder
│
└── FRONTEND/
    └── projecthub-ui/        # Angular Application
        └── src/app/
            ├── components/    # Dashboard, Tasks, Users, Login
            ├── shared/        # Sidebar Component
            ├── services/      # API Services
            ├── guards/        # Auth Guard
            └── interceptors/  # JWT Interceptor
```

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login with role-based access
- 📋 **Task Management** — Create, assign, update, and delete tasks
- 👥 **User Management** — View and manage all users
- 💬 **Comments** — Add comments to tasks for collaboration
- 📊 **Dashboard** — Overview of task statuses and activity
- 🌙 **Dark/Light Theme** — Toggle between themes

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server)
- [Angular CLI](https://angular.io/cli) — `npm install -g @angular/cli`

---

### Backend Setup

```bash
cd BACKEND/ProjectHubAPI

# Update connection string in appsettings.json
# Then run migrations and start server

dotnet ef database update
dotnet run
```

API runs at: `https://localhost:7001`

---

### Frontend Setup

```bash
cd FRONTEND/projecthub-ui

npm install
ng serve
```

App runs at: `http://localhost:4200`

---

## 🔑 Default Roles

| Role    | Access Level         |
|---------|----------------------|
| Admin   | Full access          |
| Manager | Task & user management |
| User    | View & update tasks  |

---

## 📄 License

This project is for educational purposes.

---

> Made with Passion by [Sangamithraa12](https://github.com/Sangamithraa12)
