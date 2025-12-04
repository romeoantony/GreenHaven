# GreenHaven API 🚀

The backend API for GreenHaven, built with .NET Core.

## Features

- **RESTful API**: Provides endpoints for managing plants, orders, and users.
- **Authentication**: JWT-based authentication for secure access.
- **Database**: Uses Entity Framework Core with SQL Server (or configured provider).
- **Swagger UI**: Integrated Swagger for API documentation and testing.

## Getting Started

### Prerequisites

- .NET SDK (v8.0 or compatible)
- SQL Server (or another database provider supported by EF Core)

### Installation

1.  Navigate to the API directory:

    ```bash
    cd GreenHaven.API
    ```

2.  Restore dependencies:
    ```bash
    dotnet restore
    ```

### Database Setup

1.  Update the connection string in `appsettings.json` to point to your database instance.
2.  Apply migrations to create the database schema:
    ```bash
    dotnet ef database update
    ```

### Running the API

To start the API server:

```bash
dotnet run
```

The API will be available at `http://localhost:5000` (or the configured port).
Swagger UI can be accessed at `http://localhost:5000/swagger`.

## Key Endpoints

- `GET /api/plants`: Retrieve all plants.
- `POST /api/auth/login`: Authenticate a user.
- `POST /api/orders`: Create a new order.
- `GET /api/users`: Manage users (Admin only).

## Project Structure

- `Controllers`: API controllers defining endpoints.
- `Entities`: Domain models representing database tables.
- `Data`: Database context and configuration.
- `DTOs`: Data Transfer Objects for API requests/responses.
- `Migrations`: EF Core database migrations.
