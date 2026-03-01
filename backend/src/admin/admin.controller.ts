import { Controller, Get, UseGuards, Request, ForbiddenException, Patch, Param, Body, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { Role, TransactionStatus, DisputeStatus } from '../common/enums';

@UseGuards(AuthGuard('jwt'))
@Controller('admin')
export class AdminController {
    constructor(private readonly prisma: PrismaService) { }

    // Protect all rules with an admin check
    private checkAdmin(req: any) {
        if (req.user.role !== Role.ADMIN) {
            throw new ForbiddenException('Admin access required');
        }
    }

    @Get('stats')
    async getGlobalStats(@Request() req: any) {
        this.checkAdmin(req);

        const totalUsers = await this.prisma.user.count();
        const totalOffers = await this.prisma.offer.count();

        const earningsAggregate = await this.prisma.transaction.aggregate({
            where: { status: TransactionStatus.COMPLETED },
            _sum: { price: true }
        });
        const totalVolume = earningsAggregate._sum.price || 0;

        const openDisputes = await this.prisma.dispute.count({
            where: { status: DisputeStatus.OPEN }
        });

        return {
            totalUsers,
            totalOffers,
            totalVolume,
            openDisputes
        };
    }

    @Get('users')
    async getUsers(
        @Request() req: any,
        @Query('skip') skip = '0',
        @Query('take') take = '20'
    ) {
        this.checkAdmin(req);
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                skip: parseInt(skip),
                take: parseInt(take),
                orderBy: { createdAt: 'desc' },
                select: { id: true, email: true, displayName: true, role: true, balance: true, createdAt: true }
            }),
            this.prisma.user.count()
        ]);
        return { data, total };
    }

    @Patch('users/:id/role')
    async updateUserRole(
        @Request() req: any,
        @Param('id') userId: string,
        @Body() body: { role: Role }
    ) {
        this.checkAdmin(req);

        // Don't allow changing your own role
        if (req.user.userId === userId) {
            throw new ForbiddenException('Cannot change your own role');
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: { role: body.role },
            select: { id: true, role: true, email: true }
        });
    }

    @Get('disputes')
    async getOpenDisputes(@Request() req: any) {
        this.checkAdmin(req);
        return this.prisma.dispute.findMany({
            where: { status: DisputeStatus.OPEN },
            include: { transaction: { include: { offer: true, buyer: true } } },
            orderBy: { createdAt: 'asc' }
        });
    }
}
