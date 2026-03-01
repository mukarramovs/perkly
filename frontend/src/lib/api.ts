const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('perkly_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(error.message || `API Error: ${res.status}`);
    }

    return res.json();
}

// ===== AUTH =====
export const authApi = {
    login: (data: any) =>
        request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    register: (data: any) =>
        request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    telegramLogin: (data: any) =>
        request('/auth/telegram', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    telegramMiniapp: (initData: string) =>
        request('/auth/telegram-miniapp', {
            method: 'POST',
            body: JSON.stringify({ initData }),
        }),
    me: () =>
        request('/auth/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }),
};

// ===== REVIEWS =====
export const reviewsApi = {
    create: (data: { rating: number; comment?: string; offerId: string; authorId: string }) =>
        request('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }),
    findByOfferId: (offerId: string) =>
        request(`/reviews/offer/${offerId}`),
    getOfferStats: (offerId: string) =>
        request(`/reviews/offer/${offerId}/stats`),
};

// ===== OFFERS =====
export interface OfferFilters {
    skip?: number;
    take?: number;
    category?: string;
    search?: string;
    sort?: string;
    isFlashDrop?: boolean;
    minPrice?: number;
    maxPrice?: number;
}

export const offersApi = {
    list: (filters: OfferFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
            if (val !== undefined && val !== '') params.set(key, String(val));
        });
        return request<{ data: any[]; total: number }>(`/offers?${params.toString()}`);
    },

    getById: (id: string) =>
        request<any>(`/offers/${id}`),

    create: (data: any) =>
        request<any>('/offers', { method: 'POST', body: JSON.stringify(data) }),
};

// ===== TRANSACTIONS =====
export const transactionsApi = {
    purchase: (offerId: string) =>
        request<any>('/transactions', {
            method: 'POST',
            body: JSON.stringify({ offerId }),
        }),

    list: (skip = 0, take = 20) =>
        request<{ data: any[]; total: number }>(`/transactions?skip=${skip}&take=${take}`),

    getById: (id: string) =>
        request<any>(`/transactions/${id}`),
};

// ===== USERS =====
export const usersApi = {
    getMe: () =>
        request<any>('/users/me'),

    updateProfile: (data: { displayName?: string; avatarUrl?: string }) =>
        request<any>('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    getStats: () =>
        request<{ totalSpent: number; totalPurchases: number }>('/users/me/stats'),
};

const api = {
    auth: authApi,
    reviews: reviewsApi,
    offers: offersApi,
    transactions: transactionsApi,
    users: usersApi,
    // Add generic request methods
    get: <T = any>(url: string) => request<T>(url),
    post: <T = any>(url: string, body: any) => request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
    patch: <T = any>(url: string, body: any) => request<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T = any>(url: string) => request<T>(url, { method: 'DELETE' }),
};

export default api;
