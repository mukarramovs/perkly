'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, AlertTriangle, Activity, DollarSign, Shield, Search } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [disputes, setDisputes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && (!isAuthenticated || user?.role !== 'ADMIN')) {
            router.push('/');
            return;
        }

        async function fetchData() {
            try {
                const [statsRes, usersRes, disputesRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/users?take=5'),
                    api.get('/admin/disputes')
                ]);

                setStats(statsRes.data);
                setUsers(usersRes.data.data);
                setDisputes(disputesRes.data);
            } catch (err) {
                console.error('Failed to fetch admin data', err);
            } finally {
                setIsLoading(false);
            }
        }

        if (isAuthenticated && user?.role === 'ADMIN') {
            fetchData();
        }
    }, [isAuthenticated, loading, user, router]);

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Админ Панель</h1>
                    <p className="text-gray-400">Управление платформой Perkly</p>
                </div>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="glass-card p-6 border-t-4 border-t-blue-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Пользователи</p>
                            <h3 className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-t-4 border-t-green-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Общий Оборот</p>
                            <h3 className="text-2xl font-bold text-white">${stats?.totalVolume?.toFixed(2) || '0.00'}</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-t-4 border-t-purple-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Товаров на сайте</p>
                            <h3 className="text-2xl font-bold text-white">{stats?.totalOffers || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-t-4 border-t-red-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Открытых споров</p>
                            <h3 className="text-2xl font-bold text-white">{stats?.openDisputes || 0}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Users Table (Preview) */}
                <div className="glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Новые пользователи</h2>
                        <button className="text-sm text-purple-400 hover:text-purple-300">Смотреть всех</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="text-xs uppercase bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Имя / Email</th>
                                    <th className="px-4 py-3">Роль</th>
                                    <th className="px-4 py-3 rounded-r-lg">Баланс</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u: any) => (
                                    <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-white">{u.displayName || 'Без имени'}</div>
                                            <div className="text-xs text-gray-500">{u.email}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-300'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-mono">${u.balance.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Disputes (Preview) */}
                <div className="glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            Жалобы и Споры
                        </h2>
                    </div>

                    {disputes.length === 0 ? (
                        <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10 mt-4">
                            <Shield className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
                            <p className="text-gray-400">Все чисто! Открытых споров нет.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {disputes.map((d: any) => (
                                <div key={d.id} className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white text-sm">Спор #{d.id.substring(0, 8)}</h4>
                                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-yellow-500/20 text-yellow-500 rounded">
                                            {d.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-300 mb-3 bg-black/20 p-2 rounded line-clamp-2">
                                        <span className="text-gray-500 mr-2">Причина:</span>
                                        {d.reason}
                                    </p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>Товар: <span className="text-gray-300">{d.transaction.offer.title}</span></span>
                                        <button className="text-purple-400 hover:text-purple-300 font-medium">Ответить</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
