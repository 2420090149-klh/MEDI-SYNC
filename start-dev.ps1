<#
Start-Dev.ps1

Starts the Vite front-end and the mock Express server in separate PowerShell windows and opens the browser.

Usage:
  .\start-dev.ps1            # starts both servers (assumes deps installed)
  .\start-dev.ps1 -Install  # runs npm install in root and server before starting
#>

param(
  [switch]$Install
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "MediSync dev starter — project root: $root"

if ($Install) {
  Write-Host "Installing root dependencies..."
  Push-Location $root
  npm install
  Pop-Location

  Write-Host "Installing server dependencies..."
  Push-Location (Join-Path $root 'server')
  npm install
  Pop-Location
}

Write-Host "Starting front-end (Vite) in a new window..."
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$root'; npm run dev" -WorkingDirectory $root

Write-Host "Starting mock API server in a new window..."
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$root\\server'; npm start" -WorkingDirectory (Join-Path $root 'server')

Start-Sleep -Seconds 2
Write-Host "Opening browser at http://localhost:5173"
Start-Process "http://localhost:5173"

Write-Host "Done. Front-end: http://localhost:5173  API: http://localhost:4000"
