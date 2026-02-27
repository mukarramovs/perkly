import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
        id: string;
        email: string;
        displayName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        tier: import("@prisma/client").$Enums.Tier;
        balance: number;
        rewardPoints: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMe(req: any, body: {
        displayName?: string;
        avatarUrl?: string;
    }): Promise<{
        id: string;
        email: string;
        displayName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        tier: import("@prisma/client").$Enums.Tier;
        balance: number;
        rewardPoints: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMyStats(req: any): Promise<{
        totalSpent: number;
        totalPurchases: number;
    }>;
}
