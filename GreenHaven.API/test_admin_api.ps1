$baseUrl = "http://localhost:5177/api"
$adminEmail = "admin@greenhaven.com"
$adminPassword = "Admin@123"

Write-Host "Logging in as Admin..."
$loginBody = @{
    email = $adminEmail
    password = $adminPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Admin login successful. Token received."
} catch {
    Write-Error "Admin login failed: $_"
    exit
}

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "Fetching conversations..."
try {
    $conversations = Invoke-RestMethod -Uri "$baseUrl/messages/conversations" -Method Get -Headers $headers
    Write-Host "Conversations count: $($conversations.Count)"
    $conversations | Format-Table UserId, UserName, LastMessage, UnreadCount
} catch {
    Write-Error "Fetch conversations failed: $_"
    exit
}
