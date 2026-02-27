"use client";

import { useEffect, useRef } from 'react';

interface TelegramUser {
    id: number;
    first_name: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

interface TelegramLoginWidgetProps {
    botName: string;
    onAuth: (user: TelegramUser) => void;
    buttonSize?: 'large' | 'medium' | 'small';
    cornerRadius?: number;
    requestAccess?: string;
    usePic?: boolean;
}

export default function TelegramLoginWidget({
    botName,
    onAuth,
    buttonSize = 'large',
    cornerRadius = 12,
    requestAccess = 'write',
    usePic = true,
}: TelegramLoginWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clean up existing script if any
        containerRef.current.innerHTML = '';

        // Register global callback function that Telegram's script will call
        (window as any).onTelegramAuth = (user: TelegramUser) => {
            onAuth(user);
        };

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', buttonSize);
        script.setAttribute('data-radius', cornerRadius.toString());
        script.setAttribute('data-request-access', requestAccess);
        script.setAttribute('data-userpic', usePic.toString());
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.async = true;

        containerRef.current.appendChild(script);

        return () => {
            // Cleanup global callback
            delete (window as any).onTelegramAuth;
        };
    }, [botName, onAuth, buttonSize, cornerRadius, requestAccess, usePic]);

    return <div ref={containerRef} className="flex justify-center w-full min-h-[40px]"></div>;
}
