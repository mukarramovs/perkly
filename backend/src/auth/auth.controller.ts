import { Controller, Post, Body, UnauthorizedException, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: Record<string, string>) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() body: Prisma.UserCreateInput) {
        return this.authService.register(body);
    }

    @Post('telegram')
    async telegramAuth(@Body() telegramData: any) {
        const isValid = this.authService.validateTelegramHash(telegramData);
        if (!isValid) {
            throw new UnauthorizedException('Invalid Telegram authentication payload');
        }

        const user = await this.authService.validateOrCreateTelegramUser(telegramData);
        return this.authService.login(user);
    }
}
