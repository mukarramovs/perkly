import { TransactionsService } from './transactions.service';
import { TransactionStatus } from '@prisma/client';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    purchase(req: any, body: {
        offerId: string;
    }): Promise<{
        id: string;
        offerId: string;
        buyerId: string;
        price: number;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    myTransactions(req: any, skip?: string, take?: string): Promise<{
        data: import("@prisma/client").Transaction[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        offerId: string;
        buyerId: string;
        price: number;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateStatus(id: string, body: {
        status: TransactionStatus;
    }): Promise<{
        id: string;
        offerId: string;
        buyerId: string;
        price: number;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
