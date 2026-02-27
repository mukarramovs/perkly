'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, usersApi } from './api';

interface User {
    id: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    role: string;
    tier: string;
    balance: number;
    rewardPoints: number;
}

interface AuthCtx {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName?: string) => Promise<void>;
    loginWithTelegram: (telegramData: any) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => { },
    register: async () => { },
    loginWithTelegram: async () => { },
    logout: () => { },
    refreshUser: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('perkly_token');
        if (savedToken) {
            setToken(savedToken);
            usersApi.getMe()
                .then(u => setUser(u))
                .catch(() => {
                    localStorage.removeItem('perkly_token');
                    setToken(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await authApi.login(email, password);
        localStorage.setItem('perkly_token', res.access_token);
        setToken(res.access_token);
        const profile = await usersApi.getMe();
        setUser(profile);
    };

    const register = async (email: string, password: string, displayName?: string) => {
        await authApi.register(email, password, displayName);
        await login(email, password);
    };

    const loginWithTelegram = async (telegramData: any) => {
        const res = await authApi.telegramAuth(telegramData);
        localStorage.setItem('perkly_token', res.access_token);
        setToken(res.access_token);
        const profile = await usersApi.getMe();
        setUser(profile);
    };

    const logout = () => {
        localStorage.removeItem('perkly_token');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const profile = await usersApi.getMe();
            setUser(profile);
        } catch { }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            loginWithTelegram,
            logout,
            refreshUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
