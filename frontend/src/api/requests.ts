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

    const response = await client.get<{ requests: MaintenanceRequest[] }>(`/requests?${params.toString()}`);
    return response.data.requests;
};

export const getRequestById = async (id: string) => {
    const response = await client.get<{ request: MaintenanceRequest }>(`/requests/${id}`);
    return response.data.request;
};

export const createRequest = async (data: {
    subject: string;
    description?: string;
    requestType: RequestType;
    priority: Priority;
    equipmentId: string;
    scheduledDate?: string;
}) => {
    const response = await client.post<{ request: MaintenanceRequest }>('/requests', data);
    return response.data.request;
};

export const updateRequestStatus = async (id: string, status: RequestStatus) => {
    const response = await client.patch<{ request: MaintenanceRequest }>(`/requests/${id}/status`, { status });
    return response.data.request;
};

export const assignRequest = async (id: string) => {
    // Self assign
    const response = await client.patch<{ request: MaintenanceRequest }>(`/requests/${id}/assign`);
    return response.data.request;
};

export const completeRequest = async (id: string, data: { durationHours: number; notes?: string }) => {
    const response = await client.post<{ request: MaintenanceRequest }>(`/requests/${id}/complete`, data);
    return response.data.request;
};

export const getReportingSummary = async () => {
    const response = await client.get<{
        stats: { total: number; byStatus: Record<string, number>; byPriority: Record<string, number> };
        chartData: { name: string; value: number; fill: string }[];
        barData: { name: string; count: number }[];
    }>('/requests/reports/pivot'); // Adjust endpoint if needed based on backend
    return response.data;
};
