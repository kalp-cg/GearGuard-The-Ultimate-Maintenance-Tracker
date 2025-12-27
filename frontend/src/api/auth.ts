import { client } from './client';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/auth/login', credentials);
    return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/auth/register', credentials);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await client.post('/auth/logout');
};

export const getCurrentUser = async () => {
    const response = await client.get('/auth/me');
    return response.data;
};
