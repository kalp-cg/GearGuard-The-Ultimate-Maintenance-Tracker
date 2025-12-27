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

    const response = await client.get<Equipment[]>(`/equipment?${params.toString()}`);
    return response.data;
};

export const getEquipmentById = async (id: string) => {
    const response = await client.get<Equipment>(`/equipment/${id}`);
    return response.data;
};

export const getEquipmentRequests = async (id: string) => {
    const response = await client.get(`/equipment/${id}/requests`);
    return response.data;
};

export const getEquipmentRequestsCount = async (id: string) => {
    const response = await client.get<{ count: number }>(`/equipment/${id}/requests/count`);
    return response.data;
};
