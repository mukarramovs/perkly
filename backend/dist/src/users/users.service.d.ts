import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
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
    updateProfile(id: string, data: {
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
    getStats(userId: string): Promise<{
        totalSpent: number;
        totalPurchases: number;
    }>;
}
