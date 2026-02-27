"use client";

import { useState } from "react";
import { ArrowRight, Lock, Mail, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TelegramLoginWidget from "@/components/TelegramLoginWidget";
import { useAuth } from "@/lib/AuthContext";

export default function RegisterPage() {
    const router = useRouter();
    const { register, loginWithTelegram } = useAuth();
    const [formData, setFormData] = useState({ displayName: "", email: "", passwordHash: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await register(formData.email, formData.passwordHash, formData.displayName);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Ошибка регистрации. Возможно, email уже занят.");
        } finally {
            setLoading(false);
        }
    };

    const handleTelegramAuth = async (user: any) => {
        setLoading(true);
        setError("");

        try {
            await loginWithTelegram(user);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Упс! Что-то пошло не так с Telegram.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 w-full relative overflow-hidden">
            {/* Background glow for aesthetics */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-600/10 blur-[150px] rounded-full point-events-none -z-10" />

            <div className="glass-card w-full max-w-md p-8 relative flex flex-col">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full blur-2xl opacity-50 z-0"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-full blur-3xl opacity-30 z-0"></div>

                <div className="z-10 text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 mb-4 shadow-inner">
                        <ShieldCheck className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Создать аккаунт</h1>
                    <p className="text-white/60 text-sm">Присоединяйтесь к будущему цифровой коммерции</p>
                </div>

                <div className="z-10 mb-6 flex flex-col items-center">
                    <p className="text-sm text-white/60 mb-3">Быстрый вход и регистрация</p>
                    <TelegramLoginWidget
                        botName="PerklyLoginBot"
                        onAuth={handleTelegramAuth}
                        buttonSize="large"
                    />
                </div>

                <div className="z-10 flex items-center justify-center gap-4 mb-6">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-white/40 uppercase tracking-widest">или по email</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <form onSubmit={handleSubmit} className="z-10 flex flex-col gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-white/40" />
                        </div>
                        <input
                            type="text"
                            required
                            placeholder="Ваш никнейм"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:bg-white/10 transition-all font-medium"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-white/40" />
                        </div>
                        <input
                            type="email"
                            required
                            placeholder="E-mail адрес"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:bg-white/10 transition-all font-medium"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-white/40" />
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="Придумайте пароль"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:bg-white/10 transition-all font-medium"
                            value={formData.passwordHash}
                            onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                        />
                    </div>

                    {error && <div className="text-rose-400 text-sm font-medium text-center bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Создаем..." : "Зарегистрироваться"}
                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="z-10 text-center mt-6 text-sm text-white/50">
                    Уже есть аккаунт?{" "}
                    <Link href="/login" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
}
