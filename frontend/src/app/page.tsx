'use client';

import { Clock, Gift, Gamepad2, Coffee, KeyRound, Tag, Sparkles, ArrowRight, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
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
    { title: 'Купоны', icon: Tag, count: '320+', from: '#22c55e', to: '#14b8a6', href: '/coupons' },
    { title: 'Тарифы ✨', icon: Sparkles, count: '3', from: '#fbbf24', to: '#f59e0b', href: '/pricing' },
  ];

  const [trendingOffers, setTrendingOffers] = useState<any[]>([]);
  const [flashDrops, setFlashDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        // Fetch trending (all active offers, limit to 4 for now)
        const trendingData = await api.offers.list({ take: 4, sort: 'newest' });

        // Fetch flash drops
        const flashData = await api.offers.list({ isFlashDrop: true });

        setTrendingOffers(trendingData.data || []);

        // Process flash drops to calculate remaining hours
        const processedFlashDrops = (flashData.data || []).map((drop: any) => {
          let hours = 0;
          if (drop.expiresAt) {
            const diff = new Date(drop.expiresAt).getTime() - new Date().getTime();
            hours = Math.max(0, diff / (1000 * 60 * 60)); // convert ms to hours
          }
          return { ...drop, hours };
        }).filter((d: any) => d.hours > 0);

        setFlashDrops(processedFlashDrops);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

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
          <h2 className="text-2xl font-bold text-gradient-fire flex items-center gap-2">Временные Акции <Flame className="w-6 h-6 text-orange-500" /></h2>
          <span className="text-sm text-white/30">Исчезнут совсем скоро</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          {flashDrops.length > 0 ? flashDrops.map((d, i) => (
            <Link href={`/offer/${d.id}`} key={d.id || i} className="flex items-center p-4 cursor-pointer rounded-2xl transition-all duration-300 no-underline" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 0 25px rgba(249,115,22,0.06), inset 0 0 30px rgba(249,115,22,0.03)' }}>
              <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 mr-5" style={{ boxShadow: '0 0 15px rgba(249,115,22,0.15)', background: '#111' }}>
                {d.vendorLogo ? (
                  <Image src={d.vendorLogo} fill className="object-cover" alt={d.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl"><Flame className="w-8 h-8 text-orange-500" /></div>
                )}
              </div>
              <div className="flex-1 relative z-10">
                <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{d.title}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl font-extrabold text-white">${d.price}</span>
                  {d.discountPercent > 0 && <span className="text-sm text-white/25 line-through">${(d.price / (1 - d.discountPercent / 100)).toFixed(2)}</span>}
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-red-400 font-mono px-2.5 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 0 10px rgba(239,68,68,0.08)' }}>
                  <Clock className="w-3.5 h-3.5" />
                  Осталось: <Countdown hours={d.hours} />
                </div>
              </div>
              <button className="px-5 py-2.5 rounded-xl text-white font-bold text-sm cursor-pointer border-0 ml-2 whitespace-nowrap relative z-10" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 0 25px rgba(249,115,22,0.35), 0 0 50px rgba(239,68,68,0.15)' }}>
                Забрать
              </button>
            </Link>
          )) : (
            <div className="col-span-1 md:col-span-2 text-center text-white/50 py-10">Временных акций пока нет, заходите позже!</div>
          )}
        </div>
      </section>

      {/* ======== WHEEL OF FORTUNE ======== */}
      <section className="w-full mb-20">
        <div className="glass-card flex items-center justify-between gap-12 flex-wrap p-12" style={{ background: 'linear-gradient(135deg, rgba(88,28,135,0.2), rgba(30,58,138,0.1))', borderColor: 'rgba(168,85,247,0.12)' }}>
          <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent)' }} />

          <div className="z-10 max-w-md">
            <div className="inline-flex items-center gap-2 text-purple-300 font-semibold text-sm mb-4 px-3 py-1.5 rounded-full" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6.75a2.25 2.25 0 0 0 2.25-2.25v-6.75h-9Z" />
              </svg> Испытайте Удачу
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
          {loading ? (
            <div className="col-span-1 md:col-span-4 text-center py-10 text-white/50">Загрузка скидок...</div>
          ) : trendingOffers.length > 0 ? (
            trendingOffers.map((o: any, i) => (
              <Link href={`/offer/${o.id}`} key={o.id || i} className="glass-card cursor-pointer block no-underline">
                <div className="w-full h-44 relative overflow-hidden bg-white/5 flex items-center justify-center">
                  {o.vendorLogo ? (
                    <Image src={o.vendorLogo} fill className="object-cover transition-transform duration-500 hover:scale-105" alt={o.title} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white/20">
                      <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6.75a2.25 2.25 0 0 0 2.25-2.25v-6.75h-9Z" />
                    </svg>
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white z-10" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
                    {o.category}
                  </div>
                </div>
                <div className="p-5 relative z-10">
                  <h3 className="text-base font-bold text-white mb-3 leading-snug line-clamp-2" title={o.title}>{o.title}</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      {o.discountPercent > 0 && <div className="text-xs text-white/25 line-through">${(o.price / (1 - o.discountPercent / 100)).toFixed(2)}</div>}
                      <div className="text-lg font-extrabold text-gradient-green">${o.price}</div>
                    </div>
                    <button className="px-4 py-2 rounded-xl text-white font-semibold text-sm cursor-pointer border-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Купить
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-10 text-white/50">Новых предложений пока нет</div>
          )}
        </div>
      </section>
    </div>
  );
}
