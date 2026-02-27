import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Offer } from '@prisma/client';
export declare class OffersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.OfferCreateInput): Promise<Offer>;
    findAllFiltered(params: {
        skip?: number;
        take?: number;
        category?: string;
        search?: string;
        sort?: string;
        isFlashDrop?: boolean;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<{
        data: Offer[];
        total: number;
    }>;
    findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OfferWhereUniqueInput;
        where?: Prisma.OfferWhereInput;
        orderBy?: Prisma.OfferOrderByWithRelationInput;
    }): Promise<Offer[]>;
    findOne(offerWhereUniqueInput: Prisma.OfferWhereUniqueInput): Promise<Offer | null>;
    update(params: {
        where: Prisma.OfferWhereUniqueInput;
        data: Prisma.OfferUpdateInput;
    }): Promise<Offer>;
    remove(where: Prisma.OfferWhereUniqueInput): Promise<Offer>;
}
