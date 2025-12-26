$baseUrl = "http://localhost:5177/api"
$adminEmail = "admin@greenhaven.com"
$adminPassword = "Admin@123"

$loginBody = @{ email = $adminEmail; password = $adminPassword } | ConvertTo-Json
$token = (Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json").token
$headers = @{ Authorization = "Bearer $token" }

Write-Host "--- ALL USERS ---"
# We don't have an endpoint for all users, but we can infer from messages or just trust they exist.

Write-Host "--- ALL MESSAGES (Admin View) ---"
# We don't have an endpoint to dump raw table, but we can use the conversation endpoint and the specific conversation endpoint.

# Let's try to get conversation for user8 if we can find their ID.
# Since we can't easily find ID, let's just list all conversations again and print FULL JSON.
$conversations = Invoke-RestMethod -Uri "$baseUrl/messages/conversations" -Method Get -Headers $headers
$conversations | ConvertTo-Json -Depth 5

Write-Host "--- CHECKING API TEST USER MESSAGES ---"
# We know this one exists.
