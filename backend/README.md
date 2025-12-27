# GearGuard Backend API

**Enterprise-grade Maintenance Management System**

A powerful Node.js + TypeScript + PostgreSQL + Prisma backend for tracking equipment, managing maintenance teams, and handling maintenance request workflows.

---

## 🚀 Features

### Core Functionality
- ✅ **Equipment Management** - Track all company assets with ownership and warranty information
- ✅ **Maintenance Teams** - Organize specialized teams (IT, Mechanical, Electrical, HVAC)
- ✅ **Request Workflow** - State machine-based request lifecycle (New → In Progress → Repaired → Scrap)
- ✅ **Auto-fill Logic** - Automatically populate category and team from equipment
- ✅ **Smart Buttons** - Equipment page shows related maintenance requests with badge counts
- ✅ **Team Authorization** - Only team members can work on their team's requests
- ✅ **Scrap Logic** - Automatically deactivate equipment when marked as scrap

### Advanced Features
- 📊 **Kanban Board Data** - Requests grouped by status for visual workflow
- 📅 **Calendar View** - Preventive maintenance scheduling
- ⏰ **Overdue Detection** - Backend-calculated overdue requests
- 📈 **Reporting** - Pivot/graph data for analytics
- 🔐 **JWT Authentication** - Secure token-based auth
- 👥 **Role-Based Access Control** - Admin, Manager, Technician, User roles

---

## 📋 Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **npm** or **yarn**

---

## 🛠️ Installation

### 1. Clone & Navigate
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create `.env` file (or copy from `.env.example`):
```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://postgres:root@localhost:5432/gearguard?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### 4. Create Database
Make sure PostgreSQL is running, then create the database:
```bash
# Using psql
createdb gearguard

# Or via psql command
psql -U postgres
CREATE DATABASE gearguard;
\q
```

### 5. Run Migrations
```bash
npx prisma migrate dev
```

### 6. Seed Database
```bash
npx prisma db seed
```

### 7. Start Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

---

## 🧪 Test Accounts

All accounts use password: **`password123`**

| Role | Email | Team |
|------|-------|------|
| Admin | admin@gearguard.com | - |
| Manager | manager@gearguard.com | - |
| Mechanical Tech | mike.tech@gearguard.com | Mechanical Team |
| IT Tech | sarah.it@gearguard.com | IT Support Team |
| Electrical Tech | david.elec@gearguard.com | Electrical Team |
| HVAC Tech | lisa.hvac@gearguard.com | HVAC Team |
| User | user@gearguard.com | - |

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (requires auth)
POST   /api/auth/logout      - Logout user (requires auth)
```

### Equipment
```
GET    /api/equipment                - Get all equipment
POST   /api/equipment                - Create equipment (Admin/Manager)
GET    /api/equipment/:id            - Get equipment by ID
PUT    /api/equipment/:id            - Update equipment (Admin/Manager)
DELETE /api/equipment/:id            - Delete equipment (Admin)
GET    /api/equipment/:id/requests   - Get related requests (Smart Button)
GET    /api/equipment/:id/requests/count - Get open requests count (Badge)
```

### Maintenance Requests
```
GET    /api/requests                 - Get all requests
POST   /api/requests                 - Create request
GET    /api/requests/:id             - Get request by ID
PUT    /api/requests/:id             - Update request (team members only)
DELETE /api/requests/:id             - Delete request (team members only)

# Workflow Actions
POST   /api/requests/:id/assign      - Assign to technician
POST   /api/requests/:id/start       - Start request (NEW → IN_PROGRESS)
POST   /api/requests/:id/complete    - Complete request (IN_PROGRESS → REPAIRED)
POST   /api/requests/:id/scrap       - Scrap request (IN_PROGRESS → SCRAP)

# Views
GET    /api/requests/kanban          - Kanban board data (grouped by status)
GET    /api/requests/calendar        - Calendar view (preventive maintenance)
GET    /api/requests/overdue         - Overdue requests
GET    /api/requests/reports/pivot   - Reporting data
```

### Maintenance Teams
```
GET    /api/teams                    - Get all teams
POST   /api/teams                    - Create team (Admin/Manager)
GET    /api/teams/:id                - Get team by ID
PUT    /api/teams/:id                - Update team (Admin/Manager)
DELETE /api/teams/:id                - Delete team (Admin)
POST   /api/teams/:id/members        - Add team member (Admin/Manager)
DELETE /api/teams/:id/members/:userId - Remove team member (Admin/Manager)
```

### Departments
```
GET    /api/departments              - Get all departments
POST   /api/departments              - Create department (Admin/Manager)
GET    /api/departments/:id          - Get department by ID
PUT    /api/departments/:id          - Update department (Admin/Manager)
DELETE /api/departments/:id          - Delete department (Admin)
```

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Login Request
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gearguard.com",
  "password": "password123"
}
```

### Response
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "admin@gearguard.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🎯 Key Business Logic

### 1. Auto-Fill Logic
When creating a maintenance request, selecting equipment automatically fills:
- **Category** (from equipment)
- **Maintenance Team** (from equipment)

### 2. State Machine
Requests follow strict state transitions:
```
NEW → IN_PROGRESS → REPAIRED
                  ↘ SCRAP
```

Invalid transitions are rejected by the backend.

### 3. Team Authorization
- Only team members can work on their team's requests
- Admins bypass this check
- Prevents unauthorized access to maintenance workflows

### 4. Scrap Logic
When a request is moved to `SCRAP`:
- Equipment status is automatically set to `SCRAPPED`
- No new requests can be created for scrapped equipment

### 5. Overdue Detection
- Calculated on the backend (not frontend-only)
- Compares `scheduledDate` with current time
- Only applies to `NEW` and `IN_PROGRESS` requests

---

## 📊 Database Schema

### Models
- **User** - Authentication and team membership
- **Department** - Organizational units
- **MaintenanceTeam** - Specialized maintenance teams
- **Equipment** - Company assets
- **MaintenanceRequest** - Work requests with state machine

### Key Relations
- Equipment → MaintenanceTeam (default team)
- Equipment → Department (ownership)
- Equipment → User (individual ownership)
- MaintenanceRequest → Equipment (what's broken)
- MaintenanceRequest → MaintenanceTeam (who fixes it)
- MaintenanceRequest → User (assigned technician)

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run migrate          # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
npx prisma generate      # Generate Prisma Client

# Reset database (WARNING: deletes all data)
npm run migrate:reset
```

---

## 🏗️ Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.js            # Seed data
│   └── migrations/        # Database migrations
├── src/
│   ├── config/            # Configuration files
│   │   ├── database.ts    # Prisma client
│   │   └── index.ts       # Environment config
│   ├── middleware/        # Express middleware
│   │   ├── auth.ts        # JWT authentication
│   │   ├── teamAuth.ts    # Team authorization
│   │   └── errorHandler.ts
│   ├── controllers/       # Route handlers
│   │   ├── authController.ts
│   │   ├── equipmentController.ts
│   │   ├── requestController.ts
│   │   ├── teamController.ts
│   │   └── departmentController.ts
│   ├── services/          # Business logic
│   │   ├── authService.ts
│   │   ├── equipmentService.ts
│   │   ├── requestService.ts  # State machine logic
│   │   ├── teamService.ts
│   │   └── departmentService.ts
│   ├── routes/            # API routes
│   │   ├── index.ts       # Main router
│   │   ├── authRoutes.ts
│   │   ├── equipmentRoutes.ts
│   │   ├── requestRoutes.ts
│   │   ├── teamRoutes.ts
│   │   └── departmentRoutes.ts
│   ├── utils/             # Helper functions
│   │   ├── jwt.ts         # Token generation/verification
│   │   └── password.ts    # Password hashing
│   └── server.ts          # Express app entry point
├── .env                   # Environment variables
├── .env.example           # Environment template
├── package.json
├── tsconfig.json
└── nodemon.json
```

---

## 🔍 Testing the API

### Using Prisma Studio
```bash
npm run db:studio
```
Opens a visual database browser at `http://localhost:5555`

### Using curl (PowerShell)
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing

# Login
$body = @{email='admin@gearguard.com'; password='password123'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing

# Get equipment (with auth token)
$token = "your_jwt_token_here"
Invoke-WebRequest -Uri "http://localhost:5000/api/equipment" -Headers @{Authorization="Bearer $token"} -UseBasicParsing
```

---

## 🚨 Common Issues

### Port Already in Use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists: `psql -U postgres -l`

### Prisma Client Not Generated
```bash
npx prisma generate
```

---

## 📝 License

ISC

---

## 🤝 Contributing

This is a demonstration project for an enterprise-grade maintenance management system.

---

## 📧 Support

For issues or questions, please check the API documentation above or review the implementation plan.

---

**Built with ❤️ using Node.js, TypeScript, Express, PostgreSQL, and Prisma**
