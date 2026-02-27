import { OffersService } from './offers.service';
import { Prisma, Offer } from '@prisma/client';
export declare class OffersController {
    private readonly offersService;
    constructor(offersService: OffersService);
    create(createOfferDto: Prisma.OfferCreateInput): Promise<Offer>;
    findAll(skip?: string, take?: string, category?: string, search?: string, sort?: string, isFlashDrop?: string, minPrice?: string, maxPrice?: string): Promise<{
        data: Offer[];
        total: number;
    }>;
    findOne(id: string): Promise<Offer | null>;
    update(id: string, updateOfferDto: Prisma.OfferUpdateInput): Promise<Offer>;
    remove(id: string): Promise<Offer>;
}
