$baseUrl = "http://localhost:5177/api"
$email = "api_test_user_$(Get-Random)@test.com"
$password = "User@123"

Write-Host "Registering user: $email"
$registerBody = @{
    fullName = "API Test User"
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    $token = $registerResponse.token
    Write-Host "Registration successful. Token received."
} catch {
    Write-Error "Registration failed: $_"
    exit
}

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "Sending message..."
$messageBody = @{
    content = "Hello from API Script"
} | ConvertTo-Json

try {
    $sendResponse = Invoke-RestMethod -Uri "$baseUrl/messages" -Method Post -Body $messageBody -ContentType "application/json" -Headers $headers
    Write-Host "Message sent. ID: $($sendResponse.id)"
} catch {
    Write-Error "Send message failed: $_"
    exit
}

Write-Host "Fetching messages..."
try {
    $messages = Invoke-RestMethod -Uri "$baseUrl/messages/my" -Method Get -Headers $headers
    Write-Host "Messages count: $($messages.Count)"
    $messages | Format-Table Id, Content, SenderName, Timestamp
} catch {
    Write-Error "Fetch messages failed: $_"
    exit
}
