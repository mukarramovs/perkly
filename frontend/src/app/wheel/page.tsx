import FortuneWheel from '@/components/FortuneWheel';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function WheelPage() {
    return (
        <div className="flex flex-col items-center px-6 py-12 max-w-3xl mx-auto w-full min-h-[calc(100vh-80px)]">
            {/* Back link */}
            <Link href="/" className="self-start text-sm text-white/40 hover:text-white transition mb-8 no-underline flex items-center gap-1">
                ← Назад на главную
            </Link>

            {/* Header */}
            <div className="text-center mb-10 relative">
                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }} />

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-300">Испытайте удачу</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                    Колесо Фортуны<br />
                    <span style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Perkly</span>
                </h1>

                <p className="text-white/40 text-base max-w-md mx-auto leading-relaxed">
                    Крутите колесо и выигрывайте Perkly Points, скидки и бесплатные промокоды каждый день!
                </p>
            </div>

            {/* Wheel */}
            <FortuneWheel />

            {/* Prizes table */}
            <div className="w-full mt-16 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-lg font-bold text-white mb-4">Возможные призы</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { icon: '🪙', label: '10 Points', rarity: 'Часто' },
                        { icon: '🏷️', label: 'Скидка 5%', rarity: 'Часто' },
                        { icon: '🪙', label: '25 Points', rarity: 'Средне' },
                        { icon: '☕', label: 'Бесплатный кофе', rarity: 'Редко' },
                        { icon: '💎', label: '50 Points', rarity: 'Редко' },
                        { icon: '🔥', label: 'Скидка 15%', rarity: 'Очень редко' },
                        { icon: '👑', label: '100 Points', rarity: 'Легенда' },
                        { icon: '🔄', label: 'Попробуй ещё', rarity: 'Редко' },
                    ].map((p, i) => (
                        <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <span className="text-2xl">{p.icon}</span>
                            <div>
                                <div className="text-sm font-semibold text-white">{p.label}</div>
                                <div className="text-xs text-white/30">{p.rarity}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
