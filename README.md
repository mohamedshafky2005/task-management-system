# Task Management System

A modern full-stack Task Management System built with **React**, **TypeScript**, **Node.js**, **Express**, and **MySQL**. The application enables users to securely manage tasks through an intuitive dashboard with authentication, search, filtering, sorting, pagination, and dark mode support.

---

## 🚀 Features

### Authentication
- JWT-based user authentication
- Secure login
- Protected routes

### Task Management
- Create tasks
- View tasks
- Update tasks
- Delete tasks

### Dashboard
- Task statistics
- Task summary
- User-friendly dashboard interface

### Search & Filtering
- Search tasks by keyword
- Filter tasks by status
- Sort tasks by different fields

### User Experience
- Pagination
- Dark Mode
- Loading indicators
- Toast notifications
- Responsive UI

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- React Toastify

### Backend
- Node.js
- Express.js
- TypeScript
- JWT Authentication
- MySQL
- Sequelize ORM

### Database
- MySQL

---

## 📂 Project Structure

```
task-management-system
│
├── backend
│   ├── src
│   ├── package.json
│   └── .env.example
│
├── frontend
│   ├── src
│   ├── package.json
│   └── .env.example
│
├── database
│   └── task_management_db.sql
│
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git remote add origin https://github.com/mohamedshafky2005/task-management-system.git
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example`.

Start the backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file using `.env.example`.

Start the frontend:

```bash
npm run dev
```

---

## 🗄️ Database Setup

1. Create a MySQL database.

```
task_management_db
```

2. Import the SQL dump.

```
database/task_management_db.sql
```

3. Update your `.env` file with your database credentials.

---

## 🔑 Environment Variables

Backend

```
PORT=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
JWT_EXPIRES_IN=
CLIENT_URL=
```

Frontend

```
VITE_API_URL=
```

---

## 📸 Screenshots

Add screenshots of:

- Login Page
- Dashboard
- Task Management
- Dark Mode
- Search & Filtering

---

## 🌐 Live Demo

Frontend

```
https://task-management-system-gamma-navy.vercel.app
```

Backend

```
https://task-management-system-je8g.onrender.com
```

---

## 📄 API Overview

### Authentication

```
POST /api/auth/login
POST /api/auth/register
```

### Tasks

```
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Dashboard

```
GET /api/dashboard/summary
```

---

## 📌 Future Improvements

- Refresh Token Authentication
- Unit Testing
- Email Notifications
- Role-Based Access Control
- Docker Support

---

## 👨‍💻 Author

**Mohamed Shafky**

- GitHub: https://github.com/mohamedshafky2005
- LinkedIn: https://www.linkedin.com/in/mk-mohamed-shafky-b08677330/

---

## 📃 License

This project was developed as part of a Software Engineering Technical Assessment.
