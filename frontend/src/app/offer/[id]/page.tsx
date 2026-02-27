'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Shield, Clock, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { offersApi, transactionsApi } from '@/lib/api';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';

const CATEGORY_LABELS: Record<string, string> = {
    RESTAURANTS: '🍕 Рестораны и Кафе',
    SUBSCRIPTIONS: '📺 Подписки',
    GAMES: '🎮 Игры',
    COURSES: '📚 Курсы',
    MARKETPLACES: '🛒 Маркетплейсы',
    TOURISM: '✈️ Туризм',
    FITNESS: '💪 Фитнес',
    OTHER: '📦 Другое',
};

const CATEGORY_ICONS: Record<string, string> = {
    RESTAURANTS: '🍕', SUBSCRIPTIONS: '📺', GAMES: '🎮', COURSES: '📚',
    MARKETPLACES: '🛒', TOURISM: '✈️', FITNESS: '💪', OTHER: '📦',
};

export default function OfferDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, refreshUser } = useAuth();
    const { addItem, isInCart } = useCart();

    const [offer, setOffer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [purchased, setPurchased] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (params.id) {
            offersApi.getById(params.id as string)
                .then(setOffer)
                .catch(() => setOffer(null))
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    const handleBuy = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        setPurchasing(true);
        setError('');
        try {
            await transactionsApi.purchase(offer.id);
            setPurchased(true);
            await refreshUser();
        } catch (err: any) {
            setError(err.message || 'Ошибка при покупке');
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="h-64 rounded-2xl animate-pulse mb-8" style={{ background: 'rgba(255,255,255,0.03)' }} />
                <div className="h-8 w-2/3 rounded-xl animate-pulse mb-4" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="h-4 w-1/2 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <p className="text-white/40 text-lg mb-4">Товар не найден</p>
                <Link href="/catalog" className="text-purple-400 no-underline">← Вернуться в каталог</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Back */}
            <Link href="/catalog" className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white transition mb-8 no-underline">
                <ArrowLeft className="w-4 h-4" /> Каталог
            </Link>

            <div className="grid md:grid-cols-5 gap-8">
                {/* Left - Image */}
                <div className="md:col-span-2">
                    <div className="rounded-2xl overflow-hidden aspect-square flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.1))', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-8xl">{CATEGORY_ICONS[offer.category] || '📦'}</span>
                    </div>

                    {/* Seller info */}
                    {offer.seller && (
                        <div className="mt-4 flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">{offer.seller.displayName || 'Продавец'}</div>
                                <div className="text-xs text-white/30">Продавец</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right - Info */}
                <div className="md:col-span-3">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-lg text-xs font-medium" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
                            {CATEGORY_LABELS[offer.category] || offer.category}
                        </span>
                        {offer.isFlashDrop && (
                            <span className="px-3 py-1 rounded-lg text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
                                🔥 Flash Drop
                            </span>
                        )}
                        {offer.isExclusive && (
                            <span className="px-3 py-1 rounded-lg text-xs font-bold text-yellow-300" style={{ background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.3)' }}>
                                👑 Эксклюзив
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">{offer.title}</h1>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-4xl font-black text-gradient-green">
                            {offer.price === 0 ? 'Бесплатно' : `${offer.price.toFixed(2)}$`}
                        </span>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-white/50 uppercase mb-2 tracking-wider">Описание</h3>
                        <p className="text-white/60 leading-relaxed">{offer.description}</p>
                    </div>

                    {/* Guarantee badges */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <Shield className="w-4 h-4 text-green-400" />
                            Эскроу защита
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <Clock className="w-4 h-4 text-blue-400" />
                            Мгновенная доставка
                        </div>
                    </div>

                    {/* Actions */}
                    {purchased ? (
                        <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <p className="text-green-400 font-semibold mb-1">✅ Покупка успешна!</p>
                            <p className="text-green-400/60 text-sm">Промокод доступен в вашем профиле.</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleBuy}
                                disabled={purchasing}
                                className="flex-1 py-4 rounded-xl text-white font-bold text-base cursor-pointer border-0 transition-all"
                                style={{
                                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                                    boxShadow: '0 0 25px rgba(168,85,247,0.3)',
                                    opacity: purchasing ? 0.6 : 1,
                                }}
                            >
                                {purchasing ? 'Обработка...' : offer.price === 0 ? 'Получить бесплатно' : `Купить за ${offer.price.toFixed(2)}$`}
                            </button>
                            <button
                                onClick={() => addItem({ offerId: offer.id, title: offer.title, price: offer.price, category: offer.category })}
                                disabled={isInCart(offer.id)}
                                className="px-6 py-4 rounded-xl font-semibold cursor-pointer border-0 transition-all"
                                style={{
                                    background: isInCart(offer.id) ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${isInCart(offer.id) ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}`,
                                    color: isInCart(offer.id) ? '#22c55e' : 'white',
                                }}
                            >
                                <ShoppingCart className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-400 text-sm mt-3">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
