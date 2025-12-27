import { client } from './client';
import type { Department } from '../types';

export const getDepartments = async () => {
    const response = await client.get<Department[]>('/departments');
    return response.data;
};
