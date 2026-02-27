'use client';

import { Clock, Gift, Gamepad2, Coffee, KeyRound, Tag, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function Countdown({ hours }: { hours: number }) {
  const [timeLeft, setTimeLeft] = useState(hours * 3600);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  return <span>{String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>;
}

export default function Home() {
  const categories = [
    { title: 'Игры и Аккаунты', icon: Gamepad2, count: '1.2k+', from: '#3b82f6', to: '#06b6d4', href: '/catalog?category=GAMES' },
    { title: 'Подписки', icon: KeyRound, count: '850+', from: '#a855f7', to: '#d946ef', href: '/catalog?category=SUBSCRIPTIONS' },
    { title: 'Рестораны и Кафе', icon: Coffee, count: '430+', from: '#f97316', to: '#f59e0b', href: '/catalog?category=RESTAURANTS' },
    { title: 'Маркетплейс', icon: Tag, count: '2.4k+', from: '#ec4899', to: '#f43f5e', href: '/catalog?category=MARKETPLACES' },
    { title: 'Купоны 🏷️', icon: Tag, count: '320+', from: '#22c55e', to: '#14b8a6', href: '/coupons' },
    { title: 'Тарифы ✨', icon: Sparkles, count: '3', from: '#fbbf24', to: '#f59e0b', href: '/pricing' },
  ];

  const trendingOffers = [
    { title: 'Netflix Premium 1 Месяц', price: '$4.99', oldPrice: '$19.99', cat: 'Подписки', img: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop' },
    { title: 'Dodo Pizza: Большая пицца', price: '$1.50', oldPrice: '$10.00', cat: 'Еда и Напитки', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' },
    { title: 'Steam GTA V + CS:GO Prime', price: '$15.00', oldPrice: '$35.00', cat: 'Игры', img: 'https://images.unsplash.com/photo-1628102491629-77858ab23612?q=80&w=800&auto=format&fit=crop' },
    { title: 'Discord Nitro 1 Год', price: '$45.00', oldPrice: '$99.00', cat: 'Подписки', img: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop' },
  ];

  const flashDrops = [
    { title: 'Промокод на Кофе в Safia', price: '0.50$', oldPrice: '2.50$', hours: 2, img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=400&auto=format&fit=crop' },
    { title: 'Yandex Plus 6 месяцев', price: '2.00$', oldPrice: '15.00$', hours: 5, img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <div className="flex flex-col items-center px-6 pb-24 max-w-[1200px] mx-auto w-full">

      {/* ======== HERO ======== */}
      <section className="pt-24 pb-20 text-center w-full relative">
        {/* Neon glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }} />

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">Добро пожаловать в будущее цифровой торговли</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.05]">
          Безопасный и Быстрый<br />
          <span className="text-gradient text-glow">Цифровой Маркетплейс</span>
        </h1>

        <p className="text-lg text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
          Находите невероятные скидки на подписки, игры, кафе и многое другое. Покупайте безопасно через Эскроу.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/catalog" className="px-8 py-4 rounded-full bg-white text-black font-semibold text-base flex items-center gap-2 cursor-pointer no-underline" style={{ boxShadow: '0 0 30px rgba(255,255,255,0.12)' }}>
            Начать Покупки <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/sell" className="px-8 py-4 rounded-full text-white font-medium text-base cursor-pointer no-underline" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Продать Товар
          </Link>
        </div>
      </section>

      {/* ======== FLASH DROPS ======== */}
      <section className="w-full mb-20 relative">
        {/* Warm ambient glow behind section */}
        <div className="absolute -inset-16 rounded-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.14), rgba(239,68,68,0.08) 40%, transparent 75%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12), rgba(239,68,68,0.06) 50%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="flex justify-between items-center mb-7 relative z-10">
          <h2 className="text-2xl font-bold text-gradient-fire">Временные Акции 🔥</h2>
          <span className="text-sm text-white/30">Исчезнут совсем скоро</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          {flashDrops.map((d, i) => (
            <div key={i} className="flex items-center p-4 cursor-pointer rounded-2xl transition-all duration-300" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 0 25px rgba(249,115,22,0.06), inset 0 0 30px rgba(249,115,22,0.03)' }}>
              <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 mr-5" style={{ boxShadow: '0 0 15px rgba(249,115,22,0.15)' }}>
                <Image src={d.img} fill className="object-cover" alt={d.title} />
              </div>
              <div className="flex-1 relative z-10">
                <h3 className="text-base font-bold text-white mb-1">{d.title}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl font-extrabold text-white">{d.price}</span>
                  <span className="text-sm text-white/25 line-through">{d.oldPrice}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-red-400 font-mono px-2.5 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 0 10px rgba(239,68,68,0.08)' }}>
                  <Clock className="w-3.5 h-3.5" />
                  Осталось: <Countdown hours={d.hours} />
                </div>
              </div>
              <button className="px-5 py-2.5 rounded-xl text-white font-bold text-sm cursor-pointer border-0 ml-2 whitespace-nowrap relative z-10" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 0 25px rgba(249,115,22,0.35), 0 0 50px rgba(239,68,68,0.15)' }}>
                Забрать
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ======== WHEEL OF FORTUNE ======== */}
      <section className="w-full mb-20">
        <div className="glass-card flex items-center justify-between gap-12 flex-wrap p-12" style={{ background: 'linear-gradient(135deg, rgba(88,28,135,0.2), rgba(30,58,138,0.1))', borderColor: 'rgba(168,85,247,0.12)' }}>
          <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent)' }} />

          <div className="z-10 max-w-md">
            <div className="inline-flex items-center gap-2 text-purple-300 font-semibold text-sm mb-4 px-3 py-1.5 rounded-full" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
              <Gift className="w-4 h-4" /> Испытайте Удачу
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              Колесо Фортуны<br /><span className="text-purple-400">Perkly Points</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-6">
              Крутите рулетку и выигрывайте бесплатные промокоды от Яндекс, Safia, Dodo Pizza!
            </p>
            <Link href="/wheel" className="inline-block px-6 py-3 rounded-xl text-white font-semibold no-underline" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 0 25px rgba(168,85,247,0.3)', border: 'none' }}>
              🎰 Крутить Барабан Бесплатно
            </Link>
          </div>

          <div className="z-10 relative w-60 h-60 shrink-0">
            <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', filter: 'blur(40px)' }} />
            <div className="w-48 h-48 m-6 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#ef4444 0deg 45deg, #f97316 45deg 90deg, #eab308 90deg 135deg, #22c55e 135deg 180deg, #3b82f6 180deg 225deg, #a855f7 225deg 270deg, #ec4899 270deg 315deg, #f59e0b 315deg 360deg)', border: '3px solid rgba(255,255,255,0.08)', boxShadow: '0 0 40px rgba(251,191,36,0.2)', animation: 'spin 12s linear infinite' }}>
              <div className="w-[70%] h-[70%] rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b)', boxShadow: 'inset 0 -4px 10px rgba(180,83,9,0.4)' }}>
                <span className="text-5xl font-black" style={{ color: 'rgba(120,53,15,0.6)' }}>P</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== CATEGORIES ======== */}
      <section className="w-full mb-20">
        <h2 className="text-2xl font-bold mb-7 text-white">Категории Товаров</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c, i) => (
            <Link href={c.href} key={i} className="glass-card p-5 cursor-pointer shrink-0 w-[160px] no-underline">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 relative z-10" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})`, boxShadow: `0 0 20px ${c.from}30` }}>
                <c.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1 relative z-10">{c.title}</h3>
              <p className="text-xs text-white/30 relative z-10">{c.count} предложений</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ======== HOT OFFERS ======== */}
      <section className="w-full">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-2xl font-bold text-white">Популярные Сделки</h2>
          <button className="text-sm text-purple-400 flex items-center gap-1 cursor-pointer bg-transparent border-0">
            Смотреть все <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingOffers.map((o, i) => (
            <div key={i} className="glass-card cursor-pointer">
              <div className="w-full h-44 relative overflow-hidden">
                <Image src={o.img} fill className="object-cover transition-transform duration-500 hover:scale-105" alt={o.title} />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white z-10" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
                  {o.cat}
                </div>
              </div>
              <div className="p-5 relative z-10">
                <h3 className="text-base font-bold text-white mb-3 leading-snug">{o.title}</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-white/25 line-through">{o.oldPrice}</div>
                    <div className="text-lg font-extrabold text-gradient-green">{o.price}</div>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-white font-semibold text-sm cursor-pointer border-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Купить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
