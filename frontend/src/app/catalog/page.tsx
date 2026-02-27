'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { Search, Filter, ChevronDown, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { offersApi, OfferFilters } from '@/lib/api';
import { useCart } from '@/lib/CartContext';

const CATEGORIES = [
    { value: '', label: 'Все категории' },
    { value: 'RESTAURANTS', label: '🍕 Рестораны и Кафе' },
    { value: 'SUBSCRIPTIONS', label: '📺 Подписки' },
    { value: 'GAMES', label: '🎮 Игры' },
    { value: 'COURSES', label: '📚 Курсы' },
    { value: 'MARKETPLACES', label: '🛒 Маркетплейсы' },
    { value: 'TOURISM', label: '✈️ Туризм' },
    { value: 'FITNESS', label: '💪 Фитнес' },
    { value: 'OTHER', label: '📦 Другое' },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Новые' },
    { value: 'price_asc', label: 'Цена ↑' },
    { value: 'price_desc', label: 'Цена ↓' },
    { value: 'oldest', label: 'Старые' },
];

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop';

function CatalogContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || '';
    const initialFlash = searchParams.get('isFlashDrop') === 'true';

    const [offers, setOffers] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(0);
    const [isFlashDrop, setIsFlashDrop] = useState(initialFlash);
    const { addItem, isInCart } = useCart();

    const PAGE_SIZE = 12;

    const fetchOffers = useCallback(async () => {
        setLoading(true);
        try {
            const filters: OfferFilters = {
                skip: page * PAGE_SIZE,
                take: PAGE_SIZE,
                sort,
            };
            if (category) filters.category = category;
            if (search) filters.search = search;
            if (isFlashDrop) filters.isFlashDrop = true;

            const res = await offersApi.list(filters);
            setOffers(res.data);
            setTotal(res.total);
        } catch (err) {
            console.error('Failed to fetch offers:', err);
            setOffers([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, category, sort, search, isFlashDrop]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        fetchOffers();
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                    {isFlashDrop ? (
                        <span className="text-gradient-fire">Временные Акции 🔥</span>
                    ) : category ? (
                        CATEGORIES.find(c => c.value === category)?.label || 'Каталог'
                    ) : (
                        'Каталог'
                    )}
                </h1>
                <p className="text-white/40">
                    {total > 0 ? `${total} товаров` : loading ? 'Загрузка...' : 'Нет товаров'}
                </p>
            </div>

            {/* Filters bar */}
            <div className="flex flex-wrap gap-4 mb-8">
                <form onSubmit={handleSearch} className="flex-1 min-w-[250px]">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Поиск товаров..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                        />
                    </div>
                </form>

                <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(0); }}
                    className="px-4 py-3 rounded-xl text-sm text-white outline-none cursor-pointer appearance-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', minWidth: 180 }}
                >
                    {CATEGORIES.map(c => (
                        <option key={c.value} value={c.value} style={{ background: '#111' }}>{c.label}</option>
                    ))}
                </select>

                <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(0); }}
                    className="px-4 py-3 rounded-xl text-sm text-white outline-none cursor-pointer appearance-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', minWidth: 140 }}
                >
                    {SORT_OPTIONS.map(s => (
                        <option key={s.value} value={s.value} style={{ background: '#111' }}>{s.label}</option>
                    ))}
                </select>

                <button
                    onClick={() => { setIsFlashDrop(!isFlashDrop); setPage(0); }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium cursor-pointer border-0 transition-all ${isFlashDrop ? 'text-white' : 'text-white/50'}`}
                    style={{
                        background: isFlashDrop ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isFlashDrop ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                >
                    🔥 Flash Drops
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-2xl h-72 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
                    ))}
                </div>
            ) : offers.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-white/30 text-lg mb-4">Товары не найдены</p>
                    <button onClick={() => { setSearch(''); setCategory(''); setIsFlashDrop(false); }} className="text-purple-400 cursor-pointer bg-transparent border-0 text-sm underline">
                        Сбросить фильтры
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {offers.map((offer) => (
                        <div key={offer.id} className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] group" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <Link href={`/offer/${offer.id}`} className="no-underline text-inherit">
                                <div className="relative h-40 overflow-hidden">
                                    <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.15))' }}>
                                        <div className="flex items-center justify-center h-full text-4xl opacity-50">
                                            {offer.category === 'RESTAURANTS' ? '🍕' :
                                                offer.category === 'SUBSCRIPTIONS' ? '📺' :
                                                    offer.category === 'GAMES' ? '🎮' :
                                                        offer.category === 'COURSES' ? '📚' :
                                                            offer.category === 'FITNESS' ? '💪' : '📦'}
                                        </div>
                                    </div>
                                    {offer.isFlashDrop && (
                                        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
                                            🔥 Flash
                                        </div>
                                    )}
                                    {offer.isExclusive && (
                                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-yellow-300" style={{ background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.3)' }}>
                                            👑 VIP
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="text-xs text-white/30 mb-1 uppercase tracking-wider">{offer.category}</div>
                                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug">{offer.title}</h3>
                                    <p className="text-xs text-white/30 line-clamp-2 mb-3">{offer.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-extrabold text-gradient-green">{offer.price === 0 ? 'Бесплатно' : `${offer.price.toFixed(2)}$`}</span>
                                    </div>
                                </div>
                            </Link>

                            <div className="px-4 pb-4">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addItem({ offerId: offer.id, title: offer.title, price: offer.price, category: offer.category });
                                    }}
                                    disabled={isInCart(offer.id)}
                                    className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-0 transition-all"
                                    style={{
                                        background: isInCart(offer.id) ? 'rgba(34,197,94,0.1)' : 'rgba(168,85,247,0.1)',
                                        border: `1px solid ${isInCart(offer.id) ? 'rgba(34,197,94,0.2)' : 'rgba(168,85,247,0.2)'}`,
                                        color: isInCart(offer.id) ? '#22c55e' : '#a855f7',
                                        cursor: isInCart(offer.id) ? 'default' : 'pointer',
                                    }}
                                >
                                    {isInCart(offer.id) ? '✓ В корзине' : '🛒 В корзину'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`w-10 h-10 rounded-xl text-sm font-semibold cursor-pointer border-0 transition-all ${page === i ? 'text-white' : 'text-white/40 hover:text-white'}`}
                            style={{
                                background: page === i ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'rgba(255,255,255,0.03)',
                                boxShadow: page === i ? '0 0 15px rgba(168,85,247,0.3)' : 'none',
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CatalogPage() {
    return (
        <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-8"><div className="h-8 w-48 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} /></div>}>
            <CatalogContent />
        </Suspense>
    );
}
