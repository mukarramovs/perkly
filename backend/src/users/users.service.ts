import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                displayName: true,
                avatarUrl: true,
                role: true,
                tier: true,
                balance: true,
                rewardPoints: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateProfile(id: string, data: { displayName?: string; avatarUrl?: string }) {
        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                displayName: true,
                avatarUrl: true,
                role: true,
                tier: true,
                balance: true,
                rewardPoints: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getStats(userId: string) {
        const [totalSpent, totalPurchases] = await Promise.all([
            this.prisma.transaction.aggregate({
                where: { buyerId: userId },
                _sum: { price: true },
            }),
            this.prisma.transaction.count({
                where: { buyerId: userId },
            }),
        ]);

        return {
            totalSpent: totalSpent._sum.price || 0,
            totalPurchases,
        };
    }
}
