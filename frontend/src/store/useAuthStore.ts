import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterCredentials } from '../types';
import { login as apiLogin, register as apiRegister } from '../api/auth';


interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await apiLogin(credentials);
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.error || 'Login failed',
                        isLoading: false
                    });
                    throw error;
                }
            },

            register: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await apiRegister(credentials);
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    const errData = error.response?.data;
                    const errorMsg = errData?.error
                        ? (typeof errData.error === 'string' ? errData.error : JSON.stringify(errData.error))
                        : (error.message || 'Registration failed');

                    set({
                        error: errorMsg,
                        isLoading: false
                    });
                    throw error;
                }
            },

            logout: () => {
                // apiLogout(); // Optional: Call backend logout if needed, but logic says client-side mostly
                set({ user: null, token: null, isAuthenticated: false });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
