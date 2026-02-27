'use client';

import Link from 'next/link';
import { Instagram, Twitter, MessageCircle, Mail, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full mt-auto relative" style={{ background: 'rgba(10,10,10,0.8)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)' }} />

            <div className="max-w-[1200px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-12 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {/* Brand Col */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 no-underline inline-flex">
                            <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 0 15px rgba(168,85,247,0.5)' }} />
                            <span className="text-xl font-bold tracking-tight text-white">Perkly</span>
                        </Link>
                        <p className="text-sm text-white/40 mb-6 leading-relaxed">
                            Премиальный маркетплейс цифровых услуг. Безопасные сделки, моментальная доставка и лучший кэшбек.
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://t.me/perkly_support" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                                <MessageCircle className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Col 1 */}
                    <div>
                        <h4 className="text-white font-bold mb-5">Платформа</h4>
                        <ul className="space-y-3 p-0 m-0 list-none">
                            <li><Link href="/catalog" className="text-sm text-white/40 hover:text-white transition-colors no-underline">Каталог товаров</Link></li>
                            <li><Link href="/coupons" className="text-sm text-white/40 hover:text-white transition-colors no-underline">Скидки и купоны</Link></li>
                            <li><Link href="/pricing" className="text-sm text-white/40 hover:text-white transition-colors no-underline">Тарифные планы</Link></li>
                            <li><Link href="/sell" className="text-sm text-white/40 hover:text-white transition-colors no-underline">Стать продавцом</Link></li>
                        </ul>
                    </div>

                    {/* Links Col 2 */}
                    <div>
                        <h4 className="text-white font-bold mb-5">Покупателям</h4>
                        <ul className="space-y-3 p-0 m-0 list-none">
                            <li><Link href="/wheel" className="text-sm text-white/40 hover:text-white transition-colors no-underline">Колесо Фортуны</Link></li>
                            <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors no-underline">Гарантии и Эскроу</Link></li>
                            <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors no-underline">Как купить</Link></li>
                            <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors no-underline">Частые вопросы</Link></li>
                        </ul>
                    </div>

                    {/* Contact Col */}
                    <div>
                        <h4 className="text-white font-bold mb-5">Контакты</h4>
                        <ul className="space-y-4 p-0 m-0 list-none">
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-sm text-white mb-0.5">support@perkly.com</div>
                                    <div className="text-xs text-white/40">Поддержка 24/7</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MessageCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-sm text-white mb-0.5">@perkly_support</div>
                                    <div className="text-xs text-white/40">Telegram бот</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-sm text-white mb-0.5">Ташкент, Узбекистан</div>
                                    <div className="text-xs text-white/40">Штаб-квартира</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-white/30">
                        &copy; {new Date().getFullYear()} Perkly. Все права защищены.
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-sm text-white/30 hover:text-white transition-colors no-underline">Политика конфиденциальности</Link>
                        <Link href="#" className="text-sm text-white/30 hover:text-white transition-colors no-underline">Пользовательское соглашение</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
