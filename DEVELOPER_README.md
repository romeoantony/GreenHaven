# GreenHaven Developer Documentation

Welcome to the GreenHaven project! This is a full-stack e-commerce application for indoor plants, built with a modern React frontend and a robust .NET Core backend.

## 🚀 Project Overview

GreenHaven allows users to browse plants, manage a cart, place orders, and communicate with administrators. It features a secure authentication system, role-based access control, and a real-time-like messaging widget.

## 🛠️ Tech Stack

### Frontend (`GreenHaven.UI`)

- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend (`GreenHaven.API`)

- **Framework**: .NET 8 (ASP.NET Core Web API)
- **Database**: SQL Server (LocalDB)
- **ORM**: Entity Framework Core
- **Authentication**: JWT (JSON Web Tokens) with ASP.NET Core Identity
- **Testing**: xUnit

## 📋 Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or later)
- **.NET SDK** (v8.0)
- **SQL Server** (LocalDB or full instance)

## ⚙️ Setup Instructions

### 1. Backend Setup

Navigate to the API directory:

```bash
cd GreenHaven.API
```

Update the database (applies migrations):

```bash
dotnet ef database update
```

Run the API:

```bash
dotnet run
```

The API will start at `http://localhost:5176` (or similar, check console output).

### 2. Frontend Setup

Navigate to the UI directory:

```bash
cd GreenHaven.UI
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```
GreenHaven/
├── GreenHaven.API/          # Backend ASP.NET Core project
│   ├── Controllers/         # API Endpoints
│   ├── Data/                # EF Core DbContext
│   ├── Entities/            # Database Models
│   ├── Services/            # Business Logic
│   └── Program.cs           # App Entry Point & Config
│
├── GreenHaven.UI/           # Frontend React project
│   ├── src/
│   │   ├── api/             # Axios setup & Service calls
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route components
│   │   ├── store/           # Zustand state stores
│   │   └── App.jsx          # Main App Component & Routing
│   └── tailwind.config.js   # Tailwind Configuration
│
└── GreenHaven.Tests/        # Backend Unit Tests
```

## 🔑 Key Features & Workflows

### Authentication

- Users register and login to receive a JWT.
- The token is stored in `localStorage` (via Zustand persistence) and attached to `Authorization` headers in `axios.js`.
- **Roles**: `User` and `Admin`.
- **Admin Dashboard**: Accessible only to users with the `Admin` role.

### Messaging System

- **User View**: A floating chat widget (`ChatWidget.jsx`) allows logged-in users to send messages to admins.
- **Admin View**: Admins reply via the Dashboard (`AdminDashboard.jsx`).
- **Polling**: The frontend polls for new messages every 3 seconds using React Query.

## 🐞 Debugging

### Frontend Debug Overlay

The application includes a custom on-screen debug overlay for development.

- **Location**: Bottom-right corner of the screen.
- **Usage**: Displays real-time logs for Axios requests, auth state changes, and chat widget actions.
- **Code**: Implemented in `App.jsx` (global `window.log` function).

### Common Issues

- **CORS Errors**: Ensure the API allows the frontend origin (`http://localhost:5173`). Check `Program.cs` or `ServiceExtensions.cs`.
- **Database Connection**: Verify the connection string in `appsettings.json` points to a valid LocalDB instance.

## ☁️ Deployment

### Azure App Service

1.  **Create App Service**: Create a new Web App in Azure Portal (.NET 8 stack).
2.  **Database**: Create an Azure SQL Database.
3.  **Environment Variables**: Configure the following in **Settings > Environment Variables**:
    - `ConnectionStrings:DefaultConnection`: Your Azure SQL connection string.
    - `Jwt:Key`: A secure 32+ character string.
    - `Jwt:Issuer`: Your production API URL (e.g., `https://your-app.azurewebsites.net`).
    - `Jwt:Audience`: Your production API URL.
    - `AllowedOrigins`: Your frontend URL (e.g., `https://your-frontend.azurewebsites.net`).
4.  **Migrations**: Run the generated SQL script (`migration_script_latest.sql`) against your production database to create the schema.

## 🧪 Running Tests

To run backend tests:

```bash
cd GreenHaven.Tests
dotnet test
```

---

_Happy Coding!_ 🌿
