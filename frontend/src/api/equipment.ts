import { client } from './client';
import type { Equipment } from '../types';

interface EquipmentFilters {
    departmentId?: string;
    search?: string;
}

export const getEquipment = async (filters?: EquipmentFilters) => {
    const params = new URLSearchParams();
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.search) params.append('search', filters.search);

    const response = await client.get<{ equipment: Equipment[] }>(`/equipment?${params.toString()}`);
    return response.data.equipment;
};

export const getEquipmentById = async (id: string) => {
    const response = await client.get<{ equipment: Equipment }>(`/equipment/${id}`);
    return response.data.equipment;
};

export const getEquipmentRequests = async (id: string) => {
    const response = await client.get<{ requests: any[] }>(`/equipment/${id}/requests`);
    return response.data.requests;
};

export const getEquipmentRequestsCount = async (id: string) => {
    const response = await client.get<{ count: number }>(`/equipment/${id}/requests/count`);
    return response.data.count;
};
