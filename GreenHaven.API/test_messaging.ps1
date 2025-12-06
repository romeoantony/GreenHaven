$baseUrl = "http://localhost:5177/api"
$email = "script_user@test.com"
$password = "User@123"

# 1. Register
try {
    $registerBody = @{ email = $email; password = $password; fullName = "Script User" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    $token = $response.token
    Write-Host "Registered and logged in. Token length: $($token.Length)"
}
catch {
    Write-Error "Registration failed: $_"
    # Try login if already exists
    try {
        $loginBody = @{ email = $email; password = $password } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        $token = $response.token
        Write-Host "Logged in. Token length: $($token.Length)"
    }
    catch {
        Write-Error "Login failed: $_"
        exit
    }
}

$headers = @{ Authorization = "Bearer $token" }

# 2. Send Message
try {
    $msgBody = @{ content = "Hello from Script" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/messages" -Method Post -Body $msgBody -ContentType "application/json" -Headers $headers
    Write-Host "Message sent successfully."
}
catch {
    Write-Error "Failed to send message: $_"
    exit
}

# 3. Login as Admin to verify
$adminEmail = "admin@greenhaven.com"
$adminPassword = "Admin@123"
try {
    $adminLoginBody = @{ email = $adminEmail; password = $adminPassword } | ConvertTo-Json
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
    $adminToken = $adminResponse.token
    $adminHeaders = @{ Authorization = "Bearer $adminToken" }
    Write-Host "Admin logged in."
}
catch {
    Write-Error "Admin login failed: $_"
    exit
}

# 4. Get Conversations
try {
    $conversations = Invoke-RestMethod -Uri "$baseUrl/messages/conversations" -Method Get -Headers $adminHeaders
    $found = $false
    foreach ($conv in $conversations) {
        if ($conv.lastMessage -eq "Hello from Script") {
            Write-Host "Conversation found! Last message: $($conv.lastMessage)" -ForegroundColor Green
            $found = $true
            break
        }
    }
    if (-not $found) {
        Write-Error "Conversation NOT found."
        Write-Host "Conversations: $($conversations | ConvertTo-Json)"
    }
}
catch {
    Write-Error "Failed to get conversations: $_"
}
