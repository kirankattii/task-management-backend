# Task Management App

This repository contains a task management application built with the following tech stack:

- **Frontend**: React, TypeScript (Styling using TailwindCSS)
- **Backend**: Node.js, Express
- **Database**: MongoDB

The application allows users to create, update, and delete tasks while providing insights into task progress and completion statistics.

---

## Features

1. **User Authentication**:
   - Register, Login, and Logout functionality
   - JWT-based authentication
   - Secured private routes for task operations and dashboard

2. **Task Management**:
   - CRUD operations for tasks
   - Filter tasks by priority and completion status
   - Sort tasks by start time and end time

3. **Dashboard Statistics**:
   - Total count of tasks
   - Percentage of completed and pending tasks
   - Time lapsed and estimated time left (by priority)
   - Average time for task completion


4. **Secure API**:
   - Authentication middleware for protecting routes

---

## API Endpoints

### **Authentication API**
1. `POST /api/auth/register` - User registration
2. `POST /api/auth/login` - User login
3. `POST /api/auth/logout` - User logout
4. `GET /api/auth/is-auth` - Check authentication status

### **User API**
1. `GET /api/user/data` - Fetch user data

### **Task API**
1. `POST /api/task` - Create a new task
2. `GET /api/task` - Get all tasks
3. `PUT /api/task/:id` - Update a specific task
4. `DELETE /api/task/:id` - Delete a specific task
5. `POST /api/task/delete-selected` - Delete multiple tasks by IDs
6. `POST /api/task/dashboard` - Get task statistics

---

## Installation

### Prerequisites:
- Node.js (v16 or higher)
- MongoDB (local or cloud-based, e.g., MongoDB Atlas)




## Deployment

- **Frontend**: Deployed on Vercel at `https://taskmanagement-frontend-seven.vercel.app`
- **Backend**: Hosted on Vercel `https://task-management-backend-nb2f.vercel.app`

