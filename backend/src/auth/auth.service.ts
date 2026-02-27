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

    async register(data: Prisma.UserCreateInput) {
        if (data.passwordHash) {
            const salt = await bcrypt.genSalt();
            data.passwordHash = await bcrypt.hash(data.passwordHash, salt);
        }
        const user = await this.prisma.user.create({ data });
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
