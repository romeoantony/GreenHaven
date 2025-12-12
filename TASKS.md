# Required Manual Tasks

The following tasks require manual intervention to fully secure and optimize your application.

## 1. Secure Admin Password

The admin password was previously hardcoded in `Program.cs`. It has been updated to read from the configuration `AdminPassword`.

**Action:**

- **Development:** Open `GreenHaven.API/appsettings.Development.json` (or `secrets.json` if using User Secrets) and add:
  ```json
  "AdminPassword": "YourStrongPasswordHere"
  ```
- **Production:** Set the environment variable `AdminPassword` on your server/host.

## 2. Secure JWT Key

The JWT Key in `appsettings.json` is currently a placeholder.

**Action:**

- Generate a strong, random string (at least 32 characters).
- **Development:** Update `appsettings.Development.json` or use User Secrets:
  ```json
  "Jwt": {
    "Key": "NewStrongRandomKey..."
  }
  ```
- **Production:** Set the environment variable `Jwt__Key`.

## 3. Database Migrations

Refactoring might have changed how some data is accessed, but the schema should remain the same. However, always ensure your database is up to date.

**Action:**

- Run `dotnet ef database update` to ensure everything is in sync.
