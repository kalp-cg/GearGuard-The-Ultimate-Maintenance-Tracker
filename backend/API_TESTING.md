# GearGuard API Testing Guide

Quick reference for testing all API endpoints using PowerShell.

---

## 🔐 Step 1: Login and Get Token

```powershell
# Login as Admin
$loginBody = @{
    email = 'admin@gearguard.com'
    password = 'password123'
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $loginBody -ContentType 'application/json' -UseBasicParsing

$response = $loginResponse.Content | ConvertFrom-Json
$token = $response.token

Write-Host "✅ Logged in successfully!"
Write-Host "Token: $token"
```

---

## 📋 Step 2: Test Equipment Endpoints

### Get All Equipment
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$equipment = Invoke-WebRequest -Uri 'http://localhost:5000/api/equipment' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "✅ Found $($equipment.equipment.Count) equipment items"
$equipment.equipment | Format-Table name, category, status
```

### Create New Equipment
```powershell
$newEquipment = @{
    name = 'Test Printer'
    serialNumber = 'PRINT-2024-999'
    category = 'COMPUTER'
    purchaseDate = '2024-12-27'
    location = 'Office Floor 2'
    maintenanceTeamId = '<TEAM_ID_FROM_SEED_DATA>'
} | ConvertTo-Json

$created = Invoke-WebRequest -Uri 'http://localhost:5000/api/equipment' -Method POST -Headers $headers -Body $newEquipment -ContentType 'application/json' -UseBasicParsing

Write-Host "✅ Equipment created!"
```

### Get Equipment with Related Requests (Smart Button)
```powershell
$equipmentId = '<EQUIPMENT_ID>'

$requests = Invoke-WebRequest -Uri "http://localhost:5000/api/equipment/$equipmentId/requests" -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "✅ Found $($requests.requests.Count) related requests"

# Get badge count
$count = Invoke-WebRequest -Uri "http://localhost:5000/api/equipment/$equipmentId/requests/count" -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "📊 Open requests: $($count.count)"
```

---

## 🔧 Step 3: Test Maintenance Request Workflow

### Create Maintenance Request (Auto-fill Test)
```powershell
$newRequest = @{
    subject = 'Test maintenance request'
    description = 'Testing auto-fill logic'
    requestType = 'CORRECTIVE'
    equipmentId = '<EQUIPMENT_ID>'
    scheduledDate = '2024-12-28'
} | ConvertTo-Json

$request = Invoke-WebRequest -Uri 'http://localhost:5000/api/requests' -Method POST -Headers $headers -Body $newRequest -ContentType 'application/json' -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "✅ Request created with auto-filled category: $($request.request.category)"
Write-Host "✅ Auto-filled team: $($request.request.team.name)"

$requestId = $request.request.id
```

### Assign Request to Technician
```powershell
$assignBody = @{
    technicianId = '<TECHNICIAN_ID>'
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/requests/$requestId/assign" -Method POST -Headers $headers -Body $assignBody -ContentType 'application/json' -UseBasicParsing

Write-Host "✅ Request assigned to technician"
```

### Start Request (NEW → IN_PROGRESS)
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/requests/$requestId/start" -Method POST -Headers $headers -UseBasicParsing

Write-Host "✅ Request started (NEW → IN_PROGRESS)"
```

### Complete Request (IN_PROGRESS → REPAIRED)
```powershell
$completeBody = @{
    durationHours = 2.5
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/requests/$requestId/complete" -Method POST -Headers $headers -Body $completeBody -ContentType 'application/json' -UseBasicParsing

Write-Host "✅ Request completed (IN_PROGRESS → REPAIRED)"
```

### Test Invalid State Transition
```powershell
# Try to start an already completed request (should fail)
try {
    Invoke-WebRequest -Uri "http://localhost:5000/api/requests/$requestId/start" -Method POST -Headers $headers -UseBasicParsing
} catch {
    Write-Host "❌ Invalid transition blocked (as expected): $($_.Exception.Message)"
}
```

---

## 📊 Step 4: Test Kanban Board

```powershell
$kanban = Invoke-WebRequest -Uri 'http://localhost:5000/api/requests/kanban' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "📋 Kanban Board:"
foreach ($column in $kanban.kanban) {
    Write-Host "  $($column.status): $($column.count) requests"
}
```

---

## 📅 Step 5: Test Calendar View

```powershell
$startDate = '2024-12-01'
$endDate = '2024-12-31'

$calendar = Invoke-WebRequest -Uri "http://localhost:5000/api/requests/calendar?startDate=$startDate&endDate=$endDate" -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "📅 Preventive maintenance scheduled:"
$calendar.requests | Format-Table subject, scheduledDate, @{Name='Equipment';Expression={$_.equipment.name}}
```

---

## ⏰ Step 6: Test Overdue Detection

```powershell
$overdue = Invoke-WebRequest -Uri 'http://localhost:5000/api/requests/overdue' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "⚠️ Overdue requests: $($overdue.requests.Count)"
$overdue.requests | Format-Table subject, scheduledDate, status
```

---

## 👥 Step 7: Test Team Management

### Get All Teams
```powershell
$teams = Invoke-WebRequest -Uri 'http://localhost:5000/api/teams' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "👥 Teams:"
$teams.teams | Format-Table name, specialty, @{Name='Members';Expression={$_.members.Count}}
```

### Add Team Member
```powershell
$teamId = '<TEAM_ID>'
$addMemberBody = @{
    userId = '<USER_ID>'
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/teams/$teamId/members" -Method POST -Headers $headers -Body $addMemberBody -ContentType 'application/json' -UseBasicParsing

Write-Host "✅ Team member added"
```

---

## 📈 Step 8: Test Reporting

```powershell
$reports = Invoke-WebRequest -Uri 'http://localhost:5000/api/requests/reports/pivot' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "📊 Reporting Data:"
Write-Host "By Status:"
$reports.data.byStatus | Format-Table status, @{Name='Count';Expression={$_._count.id}}

Write-Host "By Category:"
$reports.data.byCategory | Format-Table category, @{Name='Count';Expression={$_._count.id}}

Write-Host "By Type:"
$reports.data.byType | Format-Table requestType, @{Name='Count';Expression={$_._count.id}}
```

---

## 🧪 Step 9: Test Team Authorization

```powershell
# Login as a technician from a different team
$techLoginBody = @{
    email = 'sarah.it@gearguard.com'
    password = 'password123'
} | ConvertTo-Json

$techResponse = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $techLoginBody -ContentType 'application/json' -UseBasicParsing
$techToken = ($techResponse.Content | ConvertFrom-Json).token

$techHeaders = @{
    Authorization = "Bearer $techToken"
}

# Try to modify a request from a different team (should fail)
$mechanicalRequestId = '<MECHANICAL_TEAM_REQUEST_ID>'

try {
    Invoke-WebRequest -Uri "http://localhost:5000/api/requests/$mechanicalRequestId/start" -Method POST -Headers $techHeaders -UseBasicParsing
} catch {
    Write-Host "✅ Team authorization working - Access denied (as expected)"
}
```

---

## 🗑️ Step 10: Test Scrap Logic

```powershell
# Create a request and move it to SCRAP
$scrapRequest = @{
    subject = 'Equipment to be scrapped'
    requestType = 'CORRECTIVE'
    equipmentId = '<EQUIPMENT_ID>'
} | ConvertTo-Json

$scrapReq = Invoke-WebRequest -Uri 'http://localhost:5000/api/requests' -Method POST -Headers $headers -Body $scrapRequest -ContentType 'application/json' -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

$scrapReqId = $scrapReq.request.id
$equipmentId = $scrapReq.request.equipmentId

# Start it first
Invoke-WebRequest -Uri "http://localhost:5000/api/requests/$scrapReqId/start" -Method POST -Headers $headers -UseBasicParsing

# Move to SCRAP
Invoke-WebRequest -Uri "http://localhost:5000/api/requests/$scrapReqId/scrap" -Method POST -Headers $headers -UseBasicParsing

Write-Host "✅ Request moved to SCRAP"

# Check equipment status
$equipment = Invoke-WebRequest -Uri "http://localhost:5000/api/equipment/$equipmentId" -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "✅ Equipment status: $($equipment.equipment.status) (should be SCRAPPED)"

# Try to create new request for scrapped equipment (should fail)
try {
    $newReqForScrap = @{
        subject = 'This should fail'
        requestType = 'CORRECTIVE'
        equipmentId = $equipmentId
    } | ConvertTo-Json
    
    Invoke-WebRequest -Uri 'http://localhost:5000/api/requests' -Method POST -Headers $headers -Body $newReqForScrap -ContentType 'application/json' -UseBasicParsing
} catch {
    Write-Host "✅ Scrap logic working - Cannot create request for scrapped equipment"
}
```

---

## 🎯 Complete Test Script

Save this as `test-api.ps1`:

```powershell
# GearGuard API Complete Test Script

Write-Host "🚀 Starting GearGuard API Tests..." -ForegroundColor Cyan
Write-Host ""

# 1. Login
Write-Host "1️⃣ Testing Authentication..." -ForegroundColor Yellow
$loginBody = @{
    email = 'admin@gearguard.com'
    password = 'password123'
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $loginBody -ContentType 'application/json' -UseBasicParsing
$token = ($loginResponse.Content | ConvertFrom-Json).token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "✅ Login successful" -ForegroundColor Green
Write-Host ""

# 2. Get Equipment
Write-Host "2️⃣ Testing Equipment Endpoints..." -ForegroundColor Yellow
$equipment = Invoke-WebRequest -Uri 'http://localhost:5000/api/equipment' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
Write-Host "✅ Found $($equipment.equipment.Count) equipment items" -ForegroundColor Green
Write-Host ""

# 3. Get Requests
Write-Host "3️⃣ Testing Request Endpoints..." -ForegroundColor Yellow
$requests = Invoke-WebRequest -Uri 'http://localhost:5000/api/requests' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
Write-Host "✅ Found $($requests.requests.Count) maintenance requests" -ForegroundColor Green
Write-Host ""

# 4. Kanban Board
Write-Host "4️⃣ Testing Kanban Board..." -ForegroundColor Yellow
$kanban = Invoke-WebRequest -Uri 'http://localhost:5000/api/requests/kanban' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
Write-Host "✅ Kanban board loaded:" -ForegroundColor Green
foreach ($column in $kanban.kanban) {
    Write-Host "   $($column.status): $($column.count) requests"
}
Write-Host ""

# 5. Overdue Requests
Write-Host "5️⃣ Testing Overdue Detection..." -ForegroundColor Yellow
$overdue = Invoke-WebRequest -Uri 'http://localhost:5000/api/requests/overdue' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
Write-Host "✅ Found $($overdue.requests.Count) overdue requests" -ForegroundColor Green
Write-Host ""

# 6. Teams
Write-Host "6️⃣ Testing Team Endpoints..." -ForegroundColor Yellow
$teams = Invoke-WebRequest -Uri 'http://localhost:5000/api/teams' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
Write-Host "✅ Found $($teams.teams.Count) maintenance teams" -ForegroundColor Green
Write-Host ""

# 7. Departments
Write-Host "7️⃣ Testing Department Endpoints..." -ForegroundColor Yellow
$departments = Invoke-WebRequest -Uri 'http://localhost:5000/api/departments' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
Write-Host "✅ Found $($departments.departments.Count) departments" -ForegroundColor Green
Write-Host ""

# 8. Reporting
Write-Host "8️⃣ Testing Reporting..." -ForegroundColor Yellow
$reports = Invoke-WebRequest -Uri 'http://localhost:5000/api/requests/reports/pivot' -Headers $headers -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
Write-Host "✅ Reporting data loaded" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 All tests completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   Equipment: $($equipment.equipment.Count)"
Write-Host "   Requests: $($requests.requests.Count)"
Write-Host "   Teams: $($teams.teams.Count)"
Write-Host "   Departments: $($departments.departments.Count)"
Write-Host "   Overdue: $($overdue.requests.Count)"
```

Run with:
```powershell
.\test-api.ps1
```

---

## 🔍 Troubleshooting

### Server Not Running
```powershell
# Check if server is running
Test-NetConnection -ComputerName localhost -Port 5000
```

### View Server Logs
Server logs appear in the terminal where you ran `npm run dev`

### Reset Database
```powershell
cd backend
npm run migrate:reset
npx prisma db seed
```

---

## 📚 Additional Resources

- **Prisma Studio**: `npm run db:studio` - Visual database browser
- **API Health**: `http://localhost:5000/api/health`
- **Root Endpoint**: `http://localhost:5000/`

---

**Happy Testing! 🚀**
