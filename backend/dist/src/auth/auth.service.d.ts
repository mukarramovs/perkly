import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            email: any;
            sub: any;
            role: any;
            tier: any;
        };
    }>;
    register(data: Prisma.UserCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        displayName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        tier: import("@prisma/client").$Enums.Tier;
        balance: number;
        rewardPoints: number;
    }>;
    validateTelegramHash(data: any): boolean;
    validateOrCreateTelegramUser(telegramData: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        displayName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        tier: import("@prisma/client").$Enums.Tier;
        balance: number;
        rewardPoints: number;
    }>;
}
