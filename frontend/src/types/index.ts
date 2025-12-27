export type UserRole = 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'USER';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    teamId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
}

// Module A: Equipment & Depts
export interface Department {
    id: string;
    name: string;
    description?: string;
    location?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface MaintenanceTeam {
    id: string;
    name: string;
    specialty: string;
    description?: string;
    members?: User[];
}

export type EquipmentCategory = 'MACHINERY' | 'VEHICLE' | 'COMPUTER' | 'HVAC' | 'ELECTRICAL' | 'PLUMBING' | 'OTHER';
export type EquipmentStatus = 'ACTIVE' | 'INACTIVE' | 'SCRAPPED';

export interface Equipment {
    id: string;
    name: string;
    serialNumber: string;
    category: EquipmentCategory;
    purchaseDate: string;
    warrantyExpiry?: string;
    location: string;
    status: EquipmentStatus;
    departmentId?: string;
    department?: Department;
    maintenanceTeamId: string;
    maintenanceTeam?: MaintenanceTeam;
    createdAt: string;
    updatedAt: string;
}

// Module B: Inventory
export interface Part {
    id: string;
    name: string;
    sku: string;
    description?: string;
    quantity: number;
    minQuantity: number;
    cost: number;
    location?: string;
    createdAt: string;
    updatedAt: string;
}

// Module C: Requests
export type RequestType = 'CORRECTIVE' | 'PREVENTIVE';
export type RequestStatus = 'NEW' | 'IN_PROGRESS' | 'REPAIRED' | 'SCRAP';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface MaintenanceRequest {
    id: string;
    subject: string;
    description?: string;
    requestType: RequestType;
    priority: Priority;
    equipmentId: string;
    equipment?: Equipment;
    teamId: string;
    team?: MaintenanceTeam;
    assignedToId?: string;
    assignedTo?: User;
    status: RequestStatus;
    scheduledDate?: string;
    startedAt?: string;
    completedAt?: string;
    durationHours?: number;
    createdById: string;
    createdBy?: User;
    createdAt: string;
    updatedAt: string;
}
