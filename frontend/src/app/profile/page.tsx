'use client';

import { useState, useEffect } from 'react';
import { User, Crown, Coins, ShoppingBag, Settings, LogOut, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { usersApi, transactionsApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TIER_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
    SILVER: { bg: 'rgba(148,163,184,0.1)', text: '#94a3b8', glow: 'rgba(148,163,184,0.2)' },
    GOLD: { bg: 'rgba(234,179,8,0.1)', text: '#eab308', glow: 'rgba(234,179,8,0.2)' },
    PLATINUM: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7', glow: 'rgba(168,85,247,0.2)' },
};

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState({ totalSpent: 0, totalPurchases: 0 });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [txTotal, setTxTotal] = useState(0);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            usersApi.getStats().then(setStats).catch(() => { });
            transactionsApi.list(0, 50).then(res => {
                setTransactions(res.data);
                setTxTotal(res.total);
            }).catch(() => { });
        }
    }, [isAuthenticated]);

    const handleSaveName = async () => {
        try {
            await usersApi.updateProfile({ displayName: editName });
            await refreshUser();
            setEditing(false);
        } catch { }
    };

    if (isLoading || !user) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="h-40 rounded-2xl animate-pulse mb-8" style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
        );
    }

    const tier = TIER_COLORS[user.tier] || TIER_COLORS.SILVER;

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Profile card */}
            <div className="rounded-2xl p-8 mb-8 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${tier.glow}, transparent 70%)`, transform: 'translate(30%, -30%)' }} />

                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 0 30px rgba(168,85,247,0.3)' }}>
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            {editing ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="px-3 py-1 rounded-lg text-white text-lg font-bold outline-none"
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}
                                    />
                                    <button onClick={handleSaveName} className="p-1 cursor-pointer bg-transparent border-0"><Check className="w-4 h-4 text-green-400" /></button>
                                    <button onClick={() => setEditing(false)} className="p-1 cursor-pointer bg-transparent border-0"><X className="w-4 h-4 text-red-400" /></button>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-extrabold text-white">{user.displayName || 'Пользователь'}</h1>
                                    <button onClick={() => { setEditing(true); setEditName(user.displayName || ''); }} className="p-1 cursor-pointer bg-transparent border-0">
                                        <Edit2 className="w-4 h-4 text-white/30" />
                                    </button>
                                </>
                            )}
                        </div>
                        <p className="text-white/40 text-sm mb-3">{user.email}</p>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-lg text-xs font-bold" style={{ background: tier.bg, color: tier.text, border: `1px solid ${tier.text}30` }}>
                                <Crown className="w-3 h-3 inline mr-1" />{user.tier}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-extrabold text-white">{user.balance.toFixed(2)}$</div>
                    <div className="text-xs text-white/30 mt-1">Баланс</div>
                </div>
                <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <ShoppingBag className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-extrabold text-white">{stats.totalPurchases}</div>
                    <div className="text-xs text-white/30 mt-1">Покупок</div>
                </div>
                <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-extrabold text-white">{user.rewardPoints}</div>
                    <div className="text-xs text-white/30 mt-1">Perkly Points</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold cursor-pointer border-0 transition-all ${activeTab === 'history' ? 'text-white' : 'text-white/40'}`}
                    style={{ background: activeTab === 'history' ? 'rgba(168,85,247,0.15)' : 'transparent' }}
                >
                    📋 История покупок
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold cursor-pointer border-0 transition-all ${activeTab === 'settings' ? 'text-white' : 'text-white/40'}`}
                    style={{ background: activeTab === 'settings' ? 'rgba(168,85,247,0.15)' : 'transparent' }}
                >
                    ⚙️ Настройки
                </button>
            </div>

            {/* Tab content */}
            {activeTab === 'history' && (
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    {transactions.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-3" />
                            <p className="text-white/30 mb-3">Покупок пока нет</p>
                            <Link href="/catalog" className="text-purple-400 text-sm no-underline">Перейти в каталог →</Link>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <th className="text-left text-xs text-white/30 uppercase font-semibold py-3 px-4">Товар</th>
                                    <th className="text-left text-xs text-white/30 uppercase font-semibold py-3 px-4">Сумма</th>
                                    <th className="text-left text-xs text-white/30 uppercase font-semibold py-3 px-4">Статус</th>
                                    <th className="text-left text-xs text-white/30 uppercase font-semibold py-3 px-4">Дата</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="border-t border-white/5">
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-white font-medium">{tx.offer?.title || 'Товар'}</span>
                                            <div className="text-xs text-white/30">{tx.offer?.category}</div>
                                        </td>
                                        <td className="py-3 px-4 text-sm font-semibold text-white">{tx.price.toFixed(2)}$</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-md ${tx.status === 'COMPLETED' || tx.status === 'PAID' ? 'text-green-400' :
                                                    tx.status === 'PENDING' ? 'text-yellow-400' :
                                                        tx.status === 'CANCELLED' ? 'text-red-400' : 'text-white/50'
                                                }`} style={{
                                                    background: tx.status === 'COMPLETED' || tx.status === 'PAID' ? 'rgba(34,197,94,0.1)' :
                                                        tx.status === 'PENDING' ? 'rgba(234,179,8,0.1)' :
                                                            tx.status === 'CANCELLED' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                                                }}>
                                                {tx.status === 'PAID' ? 'Оплачено' : tx.status === 'COMPLETED' ? 'Завершено' :
                                                    tx.status === 'PENDING' ? 'Ожидание' : tx.status === 'CANCELLED' ? 'Отменено' : tx.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-xs text-white/30">{new Date(tx.createdAt).toLocaleDateString('ru-RU')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="mb-6">
                        <label className="text-sm text-white/50 mb-2 block">Email</label>
                        <div className="px-4 py-3 rounded-xl text-white/60 text-sm" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            {user.email}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="text-sm text-white/50 mb-2 block">Тариф</label>
                        <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: tier.bg, color: tier.text }}>
                            {user.tier} — {user.tier === 'SILVER' ? 'Базовый доступ' : user.tier === 'GOLD' ? 'Расширенный доступ' : 'Полный доступ'}
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); router.push('/'); }}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 text-sm cursor-pointer bg-transparent transition hover:bg-red-400/5"
                        style={{ border: '1px solid rgba(239,68,68,0.15)' }}
                    >
                        <LogOut className="w-4 h-4" /> Выйти из аккаунта
                    </button>
                </div>
            )}
        </div>
    );
}
