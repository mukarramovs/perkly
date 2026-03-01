import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BotService } from '../bot/bot.service';
import { Transaction } from '@prisma/client';
import { TransactionStatus } from '../common/enums';

@Injectable()
export class TransactionsService {
    private readonly logger = new Logger(TransactionsService.name);

    constructor(
        private prisma: PrismaService,
        private botService: BotService
    ) { }

    async purchase(buyerId: string, offerId: string): Promise<Transaction> {
        // Find offer
        const offer = await this.prisma.offer.findUnique({ where: { id: offerId } });
        if (!offer) throw new NotFoundException('Offer not found');
        if (!offer.isActive) throw new BadRequestException('Offer is no longer active');

        // Prevent self-purchase
        if (offer.sellerId === buyerId) {
            throw new BadRequestException('Cannot purchase your own offer');
        }

        // Check buyer balance
        const buyer = await this.prisma.user.findUnique({ where: { id: buyerId } });
        if (!buyer) throw new NotFoundException('User not found');
        if (buyer.balance < offer.price) {
            throw new BadRequestException('Insufficient balance');
        }

        // Execute transaction atomically
        const transaction = await this.prisma.$transaction(async (tx) => {
            // Deduct buyer balance
            await tx.user.update({
                where: { id: buyerId },
                data: { balance: { decrement: offer.price } },
            });

            // Credit seller balance
            await tx.user.update({
                where: { id: offer.sellerId },
                data: { balance: { increment: offer.price } },
            });

            // Add reward points to buyer (1 point per $1)
            await tx.user.update({
                where: { id: buyerId },
                data: { rewardPoints: { increment: Math.floor(offer.price) } },
            });

            // Create transaction record
            return tx.transaction.create({
                data: {
                    offerId,
                    buyerId,
                    price: offer.price,
                    status: TransactionStatus.PAID,
                },
                include: {
                    offer: { select: { id: true, title: true, category: true, hiddenData: true } },
                },
            });
        });

        // Try to notify the buyer via Telegram
        if (buyer.telegramId) {
            const message = `🎉 *Покупка успешна!*\n\nВы приобрели "${offer.title}" за $${offer.price}.\nВаш кэшбек: ${Math.floor(offer.price)} баллов.\n\n_Перейдите в приложение, чтобы забрать товар._`;
            await this.botService.sendTelegramNotification(buyer.telegramId, message);
        }

        return transaction;
    }

    async findByBuyer(buyerId: string, skip = 0, take = 20): Promise<{ data: Transaction[]; total: number }> {
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

    async findOne(id: string): Promise<Transaction | null> {
        return this.prisma.transaction.findUnique({
            where: { id },
            include: {
                offer: true,
                buyer: { select: { id: true, displayName: true, email: true } },
            },
        });
    }

    async updateStatus(id: string, status: TransactionStatus): Promise<Transaction> {
        const transaction = await this.prisma.transaction.update({
            where: { id },
            data: { status },
            include: { offer: true, buyer: true }
        });

        // Try to notify the buyer via Telegram about status changes
        if (transaction.buyer.telegramId && status === TransactionStatus.CANCELLED) {
            const message = `❌ *Заказ отменен*\n\nТранзакция по "${transaction.offer.title}" была отменена. Средства за нее возвращены на ваш баланс.`;
            await this.botService.sendTelegramNotification(transaction.buyer.telegramId, message);
        }

        return transaction;
    }
}
