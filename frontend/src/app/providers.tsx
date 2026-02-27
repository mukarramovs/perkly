'use client';

import { AuthProvider } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/CartContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthProvider>
    );
}
