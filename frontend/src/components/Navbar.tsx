'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Search, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { count } = useCart();
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const searchRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/catalog?search=${encodeURIComponent(query.trim())}`);
            setSearchOpen(false);
            setQuery('');
        }
    };

    const tierBadge = user?.tier === 'PLATINUM'
        ? { label: '💎', bg: 'linear-gradient(135deg, #a855f7, #d946ef)', shadow: '0 0 10px rgba(168,85,247,0.4)' }
        : user?.tier === 'GOLD'
            ? { label: '🥇', bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)', shadow: '0 0 10px rgba(251,191,36,0.4)' }
            : null;

    return (
        <nav className="fixed top-0 w-full z-50 glass px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
                <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 0 15px rgba(168,85,247,0.5)' }} />
                <span className="text-xl font-bold tracking-tight text-white">Perkly</span>
            </Link>

            {/* Search Bar — центральный */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
                <form onSubmit={handleSearch} className="w-full relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        ref={searchRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Поиск купонов, подписок, товаров..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm text-white placeholder-white/30 outline-none"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                </form>
            </div>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-white/50 shrink-0">
                <Link href="/catalog" className="hover:text-white transition-colors no-underline text-inherit">Каталог</Link>
                <Link href="/coupons" className="hover:text-white transition-colors no-underline text-inherit">Купоны 🏷️</Link>
                <Link href="/pricing" className="hover:text-white transition-colors no-underline text-inherit">Тарифы ✨</Link>
                <Link href="/sell" className="hover:text-white transition-colors no-underline text-inherit">Продавать</Link>
                <Link href="/wheel" className="hover:text-white transition-colors no-underline text-inherit">🎁</Link>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-4">
                {/* Mobile search toggle */}
                <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 rounded-full hover:bg-white/5 transition cursor-pointer bg-transparent border-0">
                    {searchOpen ? <X className="w-5 h-5 text-white/70" /> : <Search className="w-5 h-5 text-white/70" />}
                </button>

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
                        <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full hover:bg-white/5 transition no-underline text-white/70">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">{user?.displayName || 'Профиль'}</span>
                            {tierBadge && (
                                <span className="text-xs" title={user?.tier || ''}>{tierBadge.label}</span>
                            )}
                        </Link>
                        <button onClick={logout} className="p-2 rounded-full hover:bg-white/5 transition cursor-pointer bg-transparent border-0">
                            <LogOut className="w-4 h-4 text-white/40" />
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="px-4 py-2 text-sm font-medium rounded-full border border-white/10 hover:bg-white/5 transition flex items-center text-white no-underline">
                            Войти
                        </Link>
                        <Link href="/register" className="px-4 py-2 text-sm font-medium rounded-full bg-white text-black hover:bg-white/90 transition flex items-center no-underline" style={{ boxShadow: '0 0 20px rgba(255,255,255,0.15)' }}>
                            Начать
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile search overlay */}
            {searchOpen && (
                <div className="absolute top-full left-0 w-full p-4 md:hidden" style={{ background: 'rgba(0,0,0,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Поиск купонов, подписок, товаров..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                            autoFocus
                        />
                    </form>
                </div>
            )}
        </nav>
    );
}
