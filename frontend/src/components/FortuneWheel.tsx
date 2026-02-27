'use client';

import { useState, useRef, useEffect } from 'react';
import { Gift, X, Coins, Ticket, Coffee, Sparkles, Trophy } from 'lucide-react';

interface Prize {
    label: string;
    shortLabel: string;
    color: string;
    icon: string;
    probability: number; // weight
    value: string;
    description: string;
}

const PRIZES: Prize[] = [
    { label: '10 Perkly Points', shortLabel: '10', color: '#ef4444', icon: '🪙', probability: 30, value: '10pp', description: 'Вам начислено 10 Perkly Points!' },
    { label: 'Скидка 5%', shortLabel: '5%', color: '#f97316', icon: '🏷️', probability: 25, value: '5off', description: 'Скидка 5% на любую покупку!' },
    { label: '25 Perkly Points', shortLabel: '25', color: '#eab308', icon: '🪙', probability: 20, value: '25pp', description: 'Отлично! 25 Perkly Points!' },
    { label: 'Бесплатный кофе', shortLabel: '☕', color: '#22c55e', icon: '☕', probability: 8, value: 'coffee', description: 'Промокод на бесплатный кофе в Safia!' },
    { label: '50 Perkly Points', shortLabel: '50', color: '#3b82f6', icon: '💎', probability: 10, value: '50pp', description: 'Вау! 50 Perkly Points на ваш счёт!' },
    { label: 'Скидка 15%', shortLabel: '15%', color: '#a855f7', icon: '🔥', probability: 5, value: '15off', description: 'Суперскидка 15% на любой товар!' },
    { label: '100 Perkly Points', shortLabel: '100', color: '#ec4899', icon: '👑', probability: 1, value: '100pp', description: '🎉 ДЖЕКПОТ! 100 Perkly Points!' },
    { label: 'Попробуйте ещё', shortLabel: '🔄', color: '#f59e0b', icon: '🔄', probability: 1, value: 'retry', description: 'Не повезло... Попробуйте завтра!' },
];

const SEGMENT_ANGLE = 360 / PRIZES.length;
const SPIN_DURATION = 5000; // ms
const DAILY_LIMIT = 3;

function getWeightedRandom(): number {
    const totalWeight = PRIZES.reduce((sum, p) => sum + p.probability, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < PRIZES.length; i++) {
        random -= PRIZES[i].probability;
        if (random <= 0) return i;
    }
    return 0;
}

function getSpinsLeft(): number {
    const today = new Date().toDateString();
    const data = localStorage.getItem('perkly_wheel');
    if (!data) return DAILY_LIMIT;
    try {
        const parsed = JSON.parse(data);
        if (parsed.date !== today) return DAILY_LIMIT;
        return Math.max(0, DAILY_LIMIT - (parsed.spins || 0));
    } catch {
        return DAILY_LIMIT;
    }
}

function recordSpin() {
    const today = new Date().toDateString();
    const data = localStorage.getItem('perkly_wheel');
    let spins = 1;
    try {
        const parsed = data ? JSON.parse(data) : null;
        if (parsed?.date === today) spins = (parsed.spins || 0) + 1;
    } catch { }
    localStorage.setItem('perkly_wheel', JSON.stringify({ date: today, spins }));
}

export default function FortuneWheel() {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [prize, setPrize] = useState<Prize | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [spinsLeft, setSpinsLeft] = useState(DAILY_LIMIT);
    const [totalPoints, setTotalPoints] = useState(0);
    const wheelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSpinsLeft(getSpinsLeft());
        const pts = localStorage.getItem('perkly_points');
        setTotalPoints(pts ? parseInt(pts) : 0);
    }, []);

    const spin = () => {
        if (isSpinning || spinsLeft <= 0) return;

        setIsSpinning(true);
        setPrize(null);
        setShowModal(false);

        const winIndex = getWeightedRandom();
        // Calculate where the pointer (top) needs to land
        // The wheel's segment 0 starts at 0 degrees
        // We need the winning segment center to be at top (0 / 360)
        const segmentCenter = winIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
        // Spin several full rotations + land on the prize
        const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
        const targetRotation = fullSpins * 360 + (360 - segmentCenter);

        setRotation(prev => prev + targetRotation);

        recordSpin();
        setSpinsLeft(prev => prev - 1);

        setTimeout(() => {
            setIsSpinning(false);
            const won = PRIZES[winIndex];
            setPrize(won);
            setShowModal(true);

            // Add points
            if (won.value.endsWith('pp')) {
                const pts = parseInt(won.value);
                const current = parseInt(localStorage.getItem('perkly_points') || '0');
                const newTotal = current + pts;
                localStorage.setItem('perkly_points', String(newTotal));
                setTotalPoints(newTotal);
            }
        }, SPIN_DURATION + 300);
    };

    return (
        <div className="flex flex-col items-center">
            {/* Points display */}
            <div className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Баланс: <span className="text-yellow-400">{totalPoints}</span> Perkly Points</span>
            </div>

            {/* Wheel container */}
            <div className="relative mb-8" style={{ width: 320, height: 320 }}>
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 60px rgba(168,85,247,0.2), 0 0 120px rgba(251,191,36,0.1)', animation: isSpinning ? 'pulse-neon 0.5s infinite' : 'pulse-neon 3s infinite' }} />

                {/* Pointer (top center) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <div style={{ width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '24px solid #fff', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
                </div>

                {/* Spinning wheel */}
                <div
                    ref={wheelRef}
                    className="w-full h-full rounded-full relative overflow-hidden"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning ? `transform ${SPIN_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)` : 'none',
                        border: '4px solid rgba(255,255,255,0.1)',
                        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* SVG segments */}
                    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                        {PRIZES.map((p, i) => {
                            const startAngle = i * SEGMENT_ANGLE;
                            const endAngle = startAngle + SEGMENT_ANGLE;
                            const startRad = (startAngle * Math.PI) / 180;
                            const endRad = (endAngle * Math.PI) / 180;
                            const x1 = 100 + 100 * Math.cos(startRad);
                            const y1 = 100 + 100 * Math.sin(startRad);
                            const x2 = 100 + 100 * Math.cos(endRad);
                            const y2 = 100 + 100 * Math.sin(endRad);
                            const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

                            const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
                            const labelR = 65;
                            const lx = 100 + labelR * Math.cos(midAngle);
                            const ly = 100 + labelR * Math.sin(midAngle);
                            const labelAngle = (startAngle + endAngle) / 2 + 90;

                            return (
                                <g key={i}>
                                    <path
                                        d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                        fill={p.color}
                                        stroke="rgba(0,0,0,0.3)"
                                        strokeWidth="0.5"
                                    />
                                    <text
                                        x={lx}
                                        y={ly}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fill="white"
                                        fontSize="10"
                                        fontWeight="800"
                                        transform={`rotate(${labelAngle}, ${lx}, ${ly})`}
                                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                                    >
                                        {p.shortLabel}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Center button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b)', boxShadow: '0 0 20px rgba(245,158,11,0.4), inset 0 -3px 6px rgba(180,83,9,0.4)' }}>
                            <span className="text-2xl font-black" style={{ color: 'rgba(120,53,15,0.7)' }}>P</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spins left */}
            <div className="text-center mb-6">
                <div className="text-sm text-white/40 mb-2">
                    Осталось попыток сегодня: <span className="text-white font-bold">{spinsLeft}</span> / {DAILY_LIMIT}
                </div>
                <div className="flex gap-1.5 justify-center">
                    {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full transition-all"
                            style={{
                                background: i < spinsLeft ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'rgba(255,255,255,0.1)',
                                boxShadow: i < spinsLeft ? '0 0 8px rgba(168,85,247,0.5)' : 'none',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Spin button */}
            <button
                onClick={spin}
                disabled={isSpinning || spinsLeft <= 0}
                className="px-8 py-4 rounded-2xl text-white font-bold text-lg cursor-pointer border-0 transition-all duration-300"
                style={{
                    background: isSpinning
                        ? 'rgba(255,255,255,0.05)'
                        : spinsLeft <= 0
                            ? 'rgba(255,255,255,0.03)'
                            : 'linear-gradient(135deg, #a855f7, #ec4899)',
                    boxShadow: isSpinning || spinsLeft <= 0
                        ? 'none'
                        : '0 0 30px rgba(168,85,247,0.3), 0 0 60px rgba(168,85,247,0.1)',
                    opacity: isSpinning || spinsLeft <= 0 ? 0.5 : 1,
                    cursor: isSpinning || spinsLeft <= 0 ? 'not-allowed' : 'pointer',
                }}
            >
                {isSpinning ? '🎰 Крутится...' : spinsLeft <= 0 ? 'Приходите завтра!' : '🎰 Крутить Бесплатно'}
            </button>

            {/* Prize history hint */}
            <p className="text-xs text-white/20 mt-4 text-center max-w-xs">
                Каждый день вы получаете {DAILY_LIMIT} бесплатных попытки. Выигранные баллы начисляются автоматически.
            </p>

            {/* ======== PRIZE MODAL ======== */}
            {showModal && prize && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <div className="relative max-w-sm w-full rounded-3xl p-8 text-center" style={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 0 60px rgba(168,85,247,0.15)' }}>
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-white/30 hover:text-white transition cursor-pointer bg-transparent border-0">
                            <X className="w-5 h-5" />
                        </button>

                        {/* Prize icon */}
                        <div className="text-6xl mb-4">{prize.icon}</div>

                        {/* Title */}
                        <h3 className="text-2xl font-extrabold text-white mb-2">
                            {prize.value === 'retry' ? 'Не повезло!' : 'Поздравляем! 🎉'}
                        </h3>

                        {/* Prize name */}
                        <div className="text-lg font-bold mb-3" style={{ color: prize.color }}>
                            {prize.label}
                        </div>

                        {/* Description */}
                        <p className="text-white/50 text-sm mb-6">{prize.description}</p>

                        {/* Prize value highlight */}
                        {prize.value !== 'retry' && (
                            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl mb-6" style={{ background: `${prize.color}15`, border: `1px solid ${prize.color}30` }}>
                                {prize.value.endsWith('pp') ? (
                                    <Coins className="w-5 h-5 text-yellow-400" />
                                ) : prize.value === 'coffee' ? (
                                    <Coffee className="w-5 h-5 text-green-400" />
                                ) : (
                                    <Ticket className="w-5 h-5 text-purple-400" />
                                )}
                                <span className="font-bold text-white">{prize.label}</span>
                            </div>
                        )}

                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full py-3 rounded-xl text-white font-semibold cursor-pointer border-0"
                            style={{
                                background: prize.value === 'retry' ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${prize.color}, ${prize.color}cc)`,
                                boxShadow: prize.value === 'retry' ? 'none' : `0 0 20px ${prize.color}30`,
                            }}
                        >
                            {prize.value === 'retry' ? 'Закрыть' : 'Забрать приз!'}
                        </button>

                        {/* Remaining spins */}
                        <p className="text-xs text-white/30 mt-4">
                            Осталось попыток: {spinsLeft}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
