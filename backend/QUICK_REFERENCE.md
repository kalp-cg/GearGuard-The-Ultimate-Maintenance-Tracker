# GearGuard API - Quick Reference Card

## 🔗 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication
```
Authorization: Bearer <token>
```

## 📧 Test Accounts (password: password123)
- admin@gearguard.com
- manager@gearguard.com
- mike.tech@gearguard.com (Mechanical)
- sarah.it@gearguard.com (IT)

## 🚀 Quick Start
```powershell
# Login
$body = @{email='admin@gearguard.com'; password='password123'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
$token = ($response.Content | ConvertFrom-Json).token
$headers = @{Authorization="Bearer $token"}

# Get Equipment
Invoke-WebRequest -Uri 'http://localhost:5000/api/equipment' -Headers $headers -UseBasicParsing

# Get Requests
Invoke-WebRequest -Uri 'http://localhost:5000/api/requests' -Headers $headers -UseBasicParsing

# Kanban Board
Invoke-WebRequest -Uri 'http://localhost:5000/api/requests/kanban' -Headers $headers -UseBasicParsing
```

## 📡 Key Endpoints

### Auth
```
POST /api/auth/login
GET  /api/auth/me
```

### Equipment
```
GET  /api/equipment
POST /api/equipment
GET  /api/equipment/:id/requests        # Smart Button
GET  /api/equipment/:id/requests/count  # Badge
```

### Requests
```
GET  /api/requests
POST /api/requests                      # Auto-fill
POST /api/requests/:id/assign
POST /api/requests/:id/start            # NEW → IN_PROGRESS
POST /api/requests/:id/complete         # IN_PROGRESS → REPAIRED
POST /api/requests/:id/scrap            # IN_PROGRESS → SCRAP
GET  /api/requests/kanban               # Kanban Board
GET  /api/requests/calendar             # Calendar View
GET  /api/requests/overdue              # Overdue Requests
```

### Teams
```
GET  /api/teams
POST /api/teams/:id/members
```

### Departments
```
GET  /api/departments
POST /api/departments
```

## 🎯 State Machine
```
NEW → IN_PROGRESS → REPAIRED
                  ↘ SCRAP
```

## 💡 Key Features
- ✅ Auto-fill (equipment → category + team)
- ✅ Team Authorization
- ✅ Scrap Logic (auto-deactivate equipment)
- ✅ Smart Buttons (related requests)
- ✅ Kanban Board Data
- ✅ Calendar View
- ✅ Overdue Detection (backend)

## 🛠️ Dev Commands
```bash
npm run dev          # Start server
npm run db:studio    # Database UI
npm run db:seed      # Seed data
```

## 📊 Database
- PostgreSQL: localhost:5432
- Database: gearguard
- User: postgres
- Password: root

## 🔍 Debugging
```powershell
# Check server
Test-NetConnection localhost -Port 5000

# Health check
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
```

---
**Server Running: http://localhost:5000**
