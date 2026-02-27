'use client';

import { Calculator, ArrowRight, Shield, Zap, Users, TrendingUp, Store, BadgeCheck } from 'lucide-react';
import { useState } from 'react';

export default function SellPage() {
    const [price, setPrice] = useState(100);
    const commission = 0.1;
    const income = price - price * commission;

    const benefits = [
        { icon: Users, title: 'Тысячи покупателей', desc: 'Доступ к 50K+ активных пользователей Perkly' },
        { icon: Shield, title: 'Безопасные сделки', desc: 'Эскроу-система защищает и продавца, и покупателя' },
        { icon: Zap, title: 'Автовыдача', desc: 'Промокоды доставляются моментально после оплаты' },
        { icon: TrendingUp, title: 'Аналитика продаж', desc: 'Отслеживайте просмотры, конверсии и доход' },
    ];

    const steps = [
        { num: '01', title: 'Регистрация', desc: 'Создайте аккаунт продавца за 2 минуты' },
        { num: '02', title: 'Создайте оффер', desc: 'Добавьте купон, подписку или цифровой товар' },
        { num: '03', title: 'Получайте оплату', desc: 'Покупатель платит — вы получаете 90% на баланс' },
    ];

    return (
        <div className="flex flex-col items-center px-6 pb-24 max-w-[1200px] mx-auto w-full">
            {/* Hero */}
            <section className="pt-20 pb-16 text-center w-full relative">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />

                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                    <Store className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-300">Для бизнеса и продавцов</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-5 leading-[1.05]">
                    Продавайте на<br />
                    <span className="text-gradient-green">Perkly Маркетплейсе</span>
                </h1>

                <p className="text-lg text-white/40 max-w-lg mx-auto mb-10 leading-relaxed">
                    Рестораны, сервисы, бренды — продавайте купоны, подписки и цифровые товары тысячам покупателей.
                </p>
            </section>

            {/* Calculator */}
            <section className="w-full mb-20">
                <div className="glass-card p-8 md:p-10 flex flex-col md:flex-row items-center gap-10" style={{ background: 'linear-gradient(135deg, rgba(4,120,87,0.1), rgba(6,78,59,0.06))', borderColor: 'rgba(34,197,94,0.12)' }}>
                    <div className="flex-1 relative z-10">
                        <div className="inline-flex items-center gap-2 text-green-300 font-semibold text-sm mb-4 px-3 py-1.5 rounded-full" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                            <Calculator className="w-4 h-4" /> Калькулятор дохода
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                            Сколько вы заработаете?
                        </h2>
                        <p className="text-white/35 text-sm mb-6">
                            Комиссия платформы — всего 10%. Вы получаете 90% от каждой продажи.
                        </p>

                        <div className="mb-6">
                            <label className="text-sm text-white/50 mb-2 block">Цена вашего товара ($)</label>
                            <input
                                type="range"
                                min={1}
                                max={500}
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full accent-green-500 mb-2"
                            />
                            <div className="flex justify-between text-xs text-white/30">
                                <span>$1</span>
                                <span className="text-lg font-bold text-white">${price}</span>
                                <span>$500</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 relative z-10">
                        <div className="text-center">
                            <div className="text-sm text-white/40 mb-1">Цена товара</div>
                            <div className="text-3xl font-extrabold text-white">${price}</div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-white/20" />
                        <div className="text-center">
                            <div className="text-sm text-white/40 mb-1">Ваш доход</div>
                            <div className="text-3xl font-extrabold text-gradient-green">${income.toFixed(0)}</div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-3">
                    <span className="text-xs text-white/25">Комиссия платформы: 10% • Без скрытых платежей</span>
                </div>
            </section>

            {/* Benefits */}
            <section className="w-full mb-20">
                <h2 className="text-2xl font-bold text-white mb-7">Почему продавцы выбирают Perkly</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((b, i) => (
                        <div key={i} className="glass-card p-6 flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 relative z-10" style={{ background: 'rgba(34,197,94,0.1)' }}>
                                <b.icon className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-base font-bold text-white mb-1">{b.title}</h3>
                                <p className="text-sm text-white/35">{b.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="w-full mb-20">
                <h2 className="text-2xl font-bold text-white text-center mb-10">Как начать продавать</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {steps.map((s, i) => (
                        <div key={i} className="glass-card p-7 text-center">
                            <div className="text-4xl font-black text-white/5 mb-3 relative z-10">{s.num}</div>
                            <h3 className="text-lg font-bold text-white mb-2 relative z-10">{s.title}</h3>
                            <p className="text-sm text-white/35 relative z-10">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="w-full glass-card p-10 text-center" style={{ background: 'linear-gradient(135deg, rgba(4,120,87,0.12), rgba(6,78,59,0.06))', borderColor: 'rgba(34,197,94,0.1)' }}>
                <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent)' }} />

                <BadgeCheck className="w-10 h-10 text-green-400 mx-auto mb-4 relative z-10" />
                <h2 className="text-2xl font-extrabold text-white mb-3 relative z-10">Готовы начать?</h2>
                <p className="text-white/40 mb-6 max-w-md mx-auto relative z-10">
                    Зарегистрируйтесь как продавец и начните зарабатывать уже сегодня. Первые продажи — за 24 часа.
                </p>
                <button className="mx-auto px-8 py-4 rounded-xl text-black font-bold cursor-pointer border-0 flex items-center gap-2 relative z-10" style={{ background: 'linear-gradient(135deg, #4ade80, #22d3ee)', boxShadow: '0 0 30px rgba(34,197,94,0.25)' }}>
                    Начать продавать <ArrowRight className="w-5 h-5" />
                </button>
            </section>
        </div>
    );
}
