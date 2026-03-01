import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && user.passwordHash) {
            const isMatch = await bcrypt.compare(pass, user.passwordHash);
            if (isMatch) {
                const { passwordHash, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role, tier: user.tier };
        return {
            access_token: this.jwtService.sign(payload),
            user: payload
        };
    }

    async register(data: Record<string, any>) {
        if (data.password) {
            const salt = await bcrypt.genSalt();
            data.passwordHash = await bcrypt.hash(data.password, salt);
            delete data.password;
        }
        const user = await this.prisma.user.create({ data: data as Prisma.UserCreateInput });
        const { passwordHash, ...result } = user;
        return result;
    }

    validateTelegramHash(data: any): boolean {
        // We use the BOT TOKEN provided by the user
        const BOT_TOKEN = '8628879213:AAEjcYGFEDhgFhMQw4qZya8L1XY5Q3tUe1I';

        const { hash, ...userData } = data;
        const secretKey = require('crypto').createHash('sha256').update(BOT_TOKEN).digest();

        const dataCheckString = Object.keys(userData)
            .sort()
            .map(key => `${key}=${userData[key]}`)
            .join('\n');

        const hmac = require('crypto').createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

        return hmac === hash;
    }

    validateTelegramMiniAppHash(initData: string): any | null {
        // We use the BOT TOKEN provided by the user
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8628879213:AAEjcYGFEDhgFhMQw4qZya8L1XY5Q3tUe1I';

        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');

        if (!hash) return null;

        urlParams.delete('hash');
        urlParams.sort();

        let dataCheckString = '';
        for (const [key, value] of urlParams.entries()) {
            dataCheckString += `${key}=${value}\n`;
        }
        dataCheckString = dataCheckString.slice(0, -1);

        const secretKey = require('crypto').createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
        const hmac = require('crypto').createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

        if (hmac === hash) {
            const userStr = urlParams.get('user');
            if (userStr) {
                try {
                    return JSON.parse(userStr);
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    }

    async validateOrCreateTelegramUser(telegramData: any) {
        const telegramIdStr = telegramData.id.toString();
        // Fallback email since TG might not provide one
        const email = telegramData.username ? `${telegramData.username}@telegram.local` : `${telegramIdStr}@telegram.local`;

        let user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Create user for the first time
            user = await this.prisma.user.create({
                data: {
                    email,
                    displayName: telegramData.first_name || telegramData.username || 'Telegram User',
                    avatarUrl: telegramData.photo_url || null,
                }
            });
        }

        const { passwordHash, ...result } = user;
        return result;
    }
}
