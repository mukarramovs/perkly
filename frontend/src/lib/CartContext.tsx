'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
    offerId: string;
    title: string;
    price: number;
    category: string;
    image?: string;
}

interface CartCtx {
    items: CartItem[];
    count: number;
    total: number;
    addItem: (item: CartItem) => void;
    removeItem: (offerId: string) => void;
    clearCart: () => void;
    isInCart: (offerId: string) => boolean;
}

const CartContext = createContext<CartCtx>({
    items: [],
    count: 0,
    total: 0,
    addItem: () => { },
    removeItem: () => { },
    clearCart: () => { },
    isInCart: () => false,
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('perkly_cart');
        if (saved) {
            try { setItems(JSON.parse(saved)); } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('perkly_cart', JSON.stringify(items));
    }, [items]);

    const addItem = (item: CartItem) => {
        setItems(prev => {
            if (prev.find(i => i.offerId === item.offerId)) return prev;
            return [...prev, item];
        });
    };

    const removeItem = (offerId: string) => {
        setItems(prev => prev.filter(i => i.offerId !== offerId));
    };

    const clearCart = () => setItems([]);

    const isInCart = (offerId: string) => items.some(i => i.offerId === offerId);

    return (
        <CartContext.Provider value={{
            items,
            count: items.length,
            total: items.reduce((sum, i) => sum + i.price, 0),
            addItem,
            removeItem,
            clearCart,
            isInCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
