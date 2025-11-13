<#
Trigger a Render deploy for the configured service using environment variables.

Usage (PowerShell):
  $env:RENDER_API_KEY = 'your_key'
  $env:RENDER_SERVICE_ID = 'your_service_id'
  .\scripts\trigger-render-deploy.ps1

This avoids adding secrets to the repository; you can run this locally to trigger a deploy.
#>

$apiKey = $env:RENDER_API_KEY
$serviceId = $env:RENDER_SERVICE_ID

if (-not $apiKey -or -not $serviceId) {
    Write-Error "Environment variables RENDER_API_KEY and RENDER_SERVICE_ID must be set."
    exit 1
}

$uri = "https://api.render.com/v1/services/$serviceId/deploys"
$body = '{"clearCache":true}'

try {
    $resp = Invoke-RestMethod -Method Post -Uri $uri -Headers @{ Authorization = "Bearer $apiKey"; "Content-Type" = "application/json"; Accept = "application/json" } -Body $body
    Write-Host "Triggered deploy. Response:"
    $resp | ConvertTo-Json -Depth 5
} catch {
    Write-Error "Failed to trigger deploy: $($_.Exception.Message)"
    exit 1
}
