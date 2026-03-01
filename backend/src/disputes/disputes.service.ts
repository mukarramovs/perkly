import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BotService } from '../bot/bot.service';
import { Dispute, Message } from '@prisma/client';
import { DisputeStatus, TransactionStatus } from '../common/enums';

@Injectable()
export class DisputesService {
    private readonly logger = new Logger(DisputesService.name);

    constructor(
        private prisma: PrismaService,
        private botService: BotService
    ) { }

    async create(transactionId: string, buyerId: string, reason: string): Promise<Dispute> {
        // Find transaction
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { offer: true }
        });

        if (!transaction) throw new NotFoundException('Transaction not found');
        if (transaction.buyerId !== buyerId) throw new ForbiddenException('Only the buyer can open a dispute');

        // Cannot dispute a cancelled transaction
        if (transaction.status === TransactionStatus.CANCELLED) {
            throw new BadRequestException('Cannot dispute a cancelled transaction');
        }

        // Check if dispute already exists
        const existingDispute = await this.prisma.dispute.findUnique({
            where: { transactionId }
        });
        if (existingDispute) throw new BadRequestException('Dispute already exists for this transaction');

        return this.prisma.$transaction(async (tx) => {
            const dispute = await tx.dispute.create({
                data: {
                    // @ts-ignore
                    transactionId,
                    reason,
                    status: DisputeStatus.OPEN
                }
            });

            await tx.transaction.update({
                // @ts-ignore
                where: { id: transactionId },
                // @ts-ignore
                data: { status: TransactionStatus.DISPUTED }
            });

            return dispute;
        });
    }

    async findOne(id: string): Promise<Dispute> {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id },
            include: {
                transaction: { include: { offer: true, buyer: true } },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: { sender: { select: { id: true, displayName: true, role: true, avatarUrl: true } } }
                }
            }
        });

        if (!dispute) throw new NotFoundException('Dispute not found');
        return dispute;
    }

    async findAllForAdmin(): Promise<Dispute[]> {
        return this.prisma.dispute.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                transaction: { include: { offer: true } }
            }
        });
    }

    async addMessage(disputeId: string, senderId: string, text: string): Promise<Message> {
        const dispute = await this.prisma.dispute.findUnique({ where: { id: disputeId } });
        if (!dispute) throw new NotFoundException('Dispute not found');
        if (dispute.status === DisputeStatus.CLOSED || dispute.status === DisputeStatus.RESOLVED) {
            throw new BadRequestException('Cannot add messages to a closed/resolved dispute');
        }

        const message = await this.prisma.message.create({
            data: {
                disputeId,
                senderId,
                text
            },
            include: {
                sender: { select: { id: true, displayName: true, role: true, avatarUrl: true } },
                dispute: { include: { transaction: { include: { offer: { include: { seller: true } }, buyer: true } } } }
            }
        });

        // Notify the other party
        // @ts-ignore
        const tx = message.dispute.transaction;
        const recipientUser = senderId === tx.buyerId ? tx.offer.seller : tx.buyer;

        // @ts-ignore
        if (recipientUser.telegramId) {
            const senderName = message.sender.displayName || 'Пользователь';
            const notificationText = `💬 *Новое сообщение в споре*\nПо заказу "${tx.offer.title}"\n\n_${senderName}_: ${text}\n\n[Перейти к спору](${process.env.FRONTEND_URL || 'https://perkly.app'}/seller/disputes)`;
            // @ts-ignore
            await this.botService.sendTelegramNotification(recipientUser.telegramId, notificationText);
        }

        return message;
    }

    async resolveDispute(disputeId: string, resolverId: string, resolution: DisputeStatus.RESOLVED | DisputeStatus.CLOSED): Promise<Dispute> {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { transaction: { include: { offer: true } } }
        });
        if (!dispute) throw new NotFoundException('Dispute not found');

        // Only admin or seller can resolve (we will enforce this in the controller)

        return this.prisma.$transaction(async (tx) => {
            const updatedDispute = await tx.dispute.update({
                where: { id: disputeId },
                data: { status: resolution }
            });

            // Update transaction status depending on resolution
            const newTxStatus = resolution === DisputeStatus.RESOLVED
                ? TransactionStatus.COMPLETED
                : TransactionStatus.CANCELLED; // Assuming CLOSED means refund or cancel

            await tx.transaction.update({
                where: { id: dispute.transactionId },
                data: { status: newTxStatus }
            });

            // If cancelled, we should also revert balances (buyer +price, seller -price)
            if (newTxStatus === TransactionStatus.CANCELLED) {
                // @ts-ignore
                await tx.user.update({
                    // @ts-ignore
                    where: { id: dispute.transaction.buyerId },
                    // @ts-ignore
                    data: { balance: { increment: dispute.transaction.price } }
                });
                // @ts-ignore
                await tx.user.update({
                    // @ts-ignore
                    where: { id: dispute.transaction.offer.sellerId },
                    // @ts-ignore
                    data: { balance: { decrement: dispute.transaction.price } }
                });
            }

            // 1. Return the result of the transaction (which is the updated dispute)
            return updatedDispute;
        });

        // 2. Fetch the updated transaction with necessary details for notification
        const finalDispute = await this.prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { transaction: { include: { offer: true, buyer: true } } }
        });

        // @ts-ignore
        if (finalDispute && finalDispute.transaction && finalDispute.transaction.buyer && (finalDispute.transaction.buyer as any).telegramId) {
            const resultText = resolution === DisputeStatus.RESOLVED
                ? '✅ К сожалению/счастью, спор решен в пользу продавца. Средства переведены продавцу.'
                : '💸 Спор закрыт. Средства возвращены на ваш баланс!';

            // @ts-ignore
            const message = `⚖️ *Решение по спору*\nОтносительно покупки "${finalDispute.transaction.offer.title}":\n\n${resultText}`;

            // @ts-ignore
            await this.botService.sendTelegramNotification((finalDispute.transaction.buyer as any).telegramId, message);
        }

        return this.prisma.dispute.findUniqueOrThrow({ where: { id: disputeId } });
    }
}
