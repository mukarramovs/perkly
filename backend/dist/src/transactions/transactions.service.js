"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async purchase(buyerId, offerId) {
        const offer = await this.prisma.offer.findUnique({ where: { id: offerId } });
        if (!offer)
            throw new common_1.NotFoundException('Offer not found');
        if (!offer.isActive)
            throw new common_1.BadRequestException('Offer is no longer active');
        if (offer.sellerId === buyerId) {
            throw new common_1.BadRequestException('Cannot purchase your own offer');
        }
        const buyer = await this.prisma.user.findUnique({ where: { id: buyerId } });
        if (!buyer)
            throw new common_1.NotFoundException('User not found');
        if (buyer.balance < offer.price) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const transaction = await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: buyerId },
                data: { balance: { decrement: offer.price } },
            });
            await tx.user.update({
                where: { id: offer.sellerId },
                data: { balance: { increment: offer.price } },
            });
            await tx.user.update({
                where: { id: buyerId },
                data: { rewardPoints: { increment: Math.floor(offer.price) } },
            });
            return tx.transaction.create({
                data: {
                    offerId,
                    buyerId,
                    price: offer.price,
                    status: client_1.TransactionStatus.PAID,
                },
                include: {
                    offer: { select: { id: true, title: true, category: true, hiddenData: true } },
                },
            });
        });
        return transaction;
    }
    async findByBuyer(buyerId, skip = 0, take = 20) {
        const where = { buyerId };
        const [data, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    offer: { select: { id: true, title: true, category: true, price: true } },
                },
            }),
            this.prisma.transaction.count({ where }),
        ]);
        return { data, total };
    }
    async findOne(id) {
        return this.prisma.transaction.findUnique({
            where: { id },
            include: {
                offer: true,
                buyer: { select: { id: true, displayName: true, email: true } },
            },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.transaction.update({
            where: { id },
            data: { status },
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map