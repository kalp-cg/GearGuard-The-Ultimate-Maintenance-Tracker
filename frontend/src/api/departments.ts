import { client } from './client';
import type { Department } from '../types';

interface DepartmentResponse {
    department: Department;
}

interface DepartmentsResponse {
    departments: Department[];
}

export const getDepartments = async () => {
    const response = await client.get<DepartmentsResponse>('/departments');
    return response.data.departments;
};

export const getDepartmentById = async (id: string) => {
    const response = await client.get<DepartmentResponse>(`/departments/${id}`);
    return response.data.department;
};

export const createDepartment = async (data: Partial<Department>) => {
    const response = await client.post<DepartmentResponse>('/departments', data);
    return response.data.department;
};

export const updateDepartment = async (id: string, data: Partial<Department>) => {
    const response = await client.put<DepartmentResponse>(`/departments/${id}`, data);
    return response.data.department;
};

export const deleteDepartment = async (id: string) => {
    await client.delete(`/departments/${id}`);
};
