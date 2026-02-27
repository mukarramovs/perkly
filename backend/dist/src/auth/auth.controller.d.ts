import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: Record<string, string>): Promise<{
        access_token: string;
        user: {
            email: any;
            sub: any;
            role: any;
            tier: any;
        };
    }>;
    register(body: Prisma.UserCreateInput): Promise<{
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
    telegramAuth(telegramData: any): Promise<{
        access_token: string;
        user: {
            email: any;
            sub: any;
            role: any;
            tier: any;
        };
    }>;
}
