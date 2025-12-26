$baseUrl = "http://localhost:5177/api"
$adminEmail = "admin@greenhaven.com"
$adminPassword = "Admin@123"

# 1. Login as Admin
try {
    $loginBody = @{ email = $adminEmail; password = $adminPassword } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $response.token
    $headers = @{ Authorization = "Bearer $token" }
    Write-Host "Admin logged in successfully."
}
catch {
    Write-Error "Failed to login as admin. Ensure backend is running."
    exit
}

# 2. Get All Users
try {
    $users = Invoke-RestMethod -Uri "$baseUrl/users" -Method Get -Headers $headers
    Write-Host "Found $($users.Count) users."
}
catch {
    Write-Error "Failed to fetch users."
    exit
}

# 3. Filter and Delete Test Users
foreach ($user in $users) {
    # Criteria: Email contains 'test' or 'user' and is NOT the admin
    if (($user.email -match "test" -or $user.email -match "user") -and $user.email -ne $adminEmail) {
        Write-Host "Deleting user: $($user.fullName) ($($user.email))..."
        try {
            Invoke-RestMethod -Uri "$baseUrl/users/$($user.id)" -Method Delete -Headers $headers
            Write-Host "Deleted." -ForegroundColor Green
        }
        catch {
            Write-Error "Failed to delete $($user.email): $_"
        }
    }
}

Write-Host "Cleanup complete."
