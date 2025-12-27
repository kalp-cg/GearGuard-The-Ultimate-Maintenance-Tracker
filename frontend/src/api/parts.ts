import { client } from './client';
import type { Part } from '../types';

interface PartsResponse {
    parts: Part[];
}

interface PartResponse {
    part: Part;
}

export const getParts = async () => {
    const response = await client.get<PartsResponse>('/parts');
    return response.data.parts;
};

export const getPartById = async (id: string) => {
    const response = await client.get<PartResponse>(`/parts/${id}`);
    return response.data.part;
};

export const createPart = async (data: Partial<Part>) => {
    const response = await client.post<PartResponse>('/parts', data);
    return response.data.part;
};

export const updatePart = async (id: string, data: Partial<Part>) => {
    const response = await client.put<PartResponse>(`/parts/${id}`, data);
    return response.data.part;
};

export const deletePart = async (id: string) => {
    await client.delete(`/parts/${id}`);
};
