import { client } from './client';
import type { MaintenanceRequest, RequestType, Priority, RequestStatus } from '../types';

interface RequestFilters {
    status?: RequestStatus;
    equipmentId?: string;
    assignedToId?: string;
}

export const getRequests = async (filters?: RequestFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.equipmentId) params.append('equipmentId', filters.equipmentId);
    if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);

    const response = await client.get<MaintenanceRequest[]>(`/requests?${params.toString()}`);
    return response.data;
};

export const getRequestById = async (id: string) => {
    const response = await client.get<MaintenanceRequest>(`/requests/${id}`);
    return response.data;
};

export const createRequest = async (data: {
    subject: string;
    description?: string;
    requestType: RequestType;
    priority: Priority;
    equipmentId: string;
    scheduledDate?: string;
}) => {
    const response = await client.post<MaintenanceRequest>('/requests', data);
    return response.data;
};

export const updateRequestStatus = async (id: string, status: RequestStatus) => {
    const response = await client.patch<MaintenanceRequest>(`/requests/${id}/status`, { status });
    return response.data;
};

export const assignRequest = async (id: string) => {
    // Self assign
    const response = await client.patch<MaintenanceRequest>(`/requests/${id}/assign`);
    return response.data;
};

export const completeRequest = async (id: string, data: { durationHours: number; notes?: string }) => {
    const response = await client.post<MaintenanceRequest>(`/requests/${id}/complete`, data);
    return response.data;
};
