import { PrismaService } from '../prisma/prisma.service';
import { Transaction, TransactionStatus } from '@prisma/client';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    purchase(buyerId: string, offerId: string): Promise<Transaction>;
    findByBuyer(buyerId: string, skip?: number, take?: number): Promise<{
        data: Transaction[];
        total: number;
    }>;
    findOne(id: string): Promise<Transaction | null>;
    updateStatus(id: string, status: TransactionStatus): Promise<Transaction>;
}
