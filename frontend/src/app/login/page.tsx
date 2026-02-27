"use client";

import { useState, Suspense } from "react";
import { ArrowRight, Lock, Mail, Fingerprint } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import TelegramLoginWidget from "@/components/TelegramLoginWidget";
import { useAuth } from "@/lib/AuthContext";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams.get("registered");
    const { login, loginWithTelegram } = useAuth();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(formData.email, formData.password);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Неверный email или пароль.");
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
        <div className="glass-card w-full max-w-md p-8 relative flex flex-col">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-2xl opacity-40 z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-30 z-0"></div>

            <div className="z-10 text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 mb-4 shadow-inner">
                    <Fingerprint className="w-6 h-6 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">С возвращением</h1>
                <p className="text-white/60 text-sm">Войдите, чтобы продолжить покупки</p>
            </div>

            {isRegistered && (
                <div className="z-10 text-emerald-400 text-sm font-medium text-center bg-emerald-500/10 py-3 mb-6 rounded-lg border border-emerald-500/20">
                    Успешная регистрация! Теперь вы можете войти.
                </div>
            )}

            <div className="z-10 mb-6 flex flex-col items-center">
                <p className="text-sm text-white/60 mb-3">Вход в один клик</p>
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
                        <Mail className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                        type="email"
                        required
                        placeholder="Ваш E-mail"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 transition-all font-medium"
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
                        placeholder="Ваш пароль"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 transition-all font-medium"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <div className="flex justify-end w-full">
                    <a href="#" className="text-xs text-white/40 hover:text-white/80 transition-colors">Забыли пароль?</a>
                </div>

                {error && <div className="text-rose-400 text-sm font-medium text-center bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Проверка..." : "Войти"}
                    {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <p className="z-10 text-center mt-6 text-sm text-white/50">
                Нет аккаунта?{" "}
                <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                    Создать
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 w-full relative overflow-hidden">
            {/* Background glow for aesthetics */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full point-events-none -z-10" />

            <Suspense fallback={<div className="text-white/50">Loading form...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
