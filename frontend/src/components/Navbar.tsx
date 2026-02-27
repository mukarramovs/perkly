'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { count } = useCart();

    return (
        <nav className="fixed top-0 w-full z-50 glass px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 no-underline">
                <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 0 15px rgba(168,85,247,0.5)' }} />
                <span className="text-xl font-bold tracking-tight text-white">Perkly</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
                <Link href="/catalog" className="hover:text-white transition-colors no-underline text-inherit">Каталог</Link>
                <Link href="/catalog?category=RESTAURANTS" className="hover:text-white transition-colors no-underline text-inherit">Рестораны и Кафе</Link>
                <Link href="/catalog?category=SUBSCRIPTIONS" className="hover:text-white transition-colors no-underline text-inherit">Подписки</Link>
                <Link href="/catalog?isFlashDrop=true" className="hover:text-white transition-colors no-underline text-inherit">Временные Акции 🔥</Link>
                <Link href="/wheel" className="hover:text-white transition-colors no-underline text-inherit">Колесо Фортуны 🎁</Link>
            </div>

            <div className="flex items-center gap-3">
                {/* Cart */}
                <Link href="/cart" className="relative p-2 rounded-full hover:bg-white/5 transition no-underline">
                    <ShoppingCart className="w-5 h-5 text-white/70" />
                    {count > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 0 10px rgba(168,85,247,0.5)' }}>
                            {count}
                        </span>
                    )}
                </Link>

                {isAuthenticated ? (
                    <>
                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full hover:bg-white/5 transition no-underline text-white/70">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">{user?.displayName || 'Профиль'}</span>
                        </Link>
                        <button onClick={logout} className="p-2 rounded-full hover:bg-white/5 transition cursor-pointer bg-transparent border-0">
                            <LogOut className="w-4 h-4 text-white/40" />
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="px-5 py-2 text-sm font-medium rounded-full border border-white/10 hover:bg-white/5 transition flex items-center text-white no-underline">
                            Войти
                        </Link>
                        <Link href="/register" className="px-5 py-2 text-sm font-medium rounded-full bg-white text-black hover:bg-white/90 transition flex items-center no-underline" style={{ boxShadow: '0 0 20px rgba(255,255,255,0.15)' }}>
                            Начать
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
