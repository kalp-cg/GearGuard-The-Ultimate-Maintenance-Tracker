import { client } from './client';
import type { MaintenanceTeam } from '../types';

export const getTeams = async () => {
    const response = await client.get<MaintenanceTeam[]>('/teams');
    return response.data;
};

export const getTeamById = async (id: string) => {
    const response = await client.get<MaintenanceTeam>(`/teams/${id}`);
    return response.data;
};
