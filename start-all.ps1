# Navigate to backend and start server
Start-Process powershell -ArgumentList "cd `"$PWD\farm-management-backend`"; npm start" -NoNewWindow

# Navigate to frontend and start React app
Start-Process powershell -ArgumentList "cd `"$PWD\farm-management-frontend`"; npm start" -NoNewWindow

Write-Host "✅ Backend and frontend are starting..."

# .\start-all.ps1