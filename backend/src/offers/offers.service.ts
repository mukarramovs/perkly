import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Offer } from '@prisma/client';

@Injectable()
export class OffersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.OfferCreateInput): Promise<Offer> {
        return this.prisma.offer.create({ data });
    }

    async findAllFiltered(params: {
        skip?: number;
        take?: number;
        category?: string;
        search?: string;
        sort?: string;
        isFlashDrop?: boolean;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<{ data: Offer[]; total: number }> {
        const { skip = 0, take = 20, category, search, sort, isFlashDrop, minPrice, maxPrice } = params;

        const where: Prisma.OfferWhereInput = {
            isActive: true,
        };

        if (category) {
            where.category = category as any;
        }

        if (isFlashDrop !== undefined) {
            where.isFlashDrop = isFlashDrop;
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) (where.price as any).gte = minPrice;
            if (maxPrice !== undefined) (where.price as any).lte = maxPrice;
        }

        let orderBy: Prisma.OfferOrderByWithRelationInput = { createdAt: 'desc' };
        if (sort === 'price_asc') orderBy = { price: 'asc' };
        if (sort === 'price_desc') orderBy = { price: 'desc' };
        if (sort === 'newest') orderBy = { createdAt: 'desc' };
        if (sort === 'oldest') orderBy = { createdAt: 'asc' };

        const [data, total] = await Promise.all([
            this.prisma.offer.findMany({
                skip,
                take,
                where,
                orderBy,
                include: { seller: { select: { id: true, displayName: true, avatarUrl: true } } },
            }),
            this.prisma.offer.count({ where }),
        ]);

        return { data, total };
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OfferWhereUniqueInput;
        where?: Prisma.OfferWhereInput;
        orderBy?: Prisma.OfferOrderByWithRelationInput;
    }): Promise<Offer[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.offer.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findOne(offerWhereUniqueInput: Prisma.OfferWhereUniqueInput): Promise<Offer | null> {
        return this.prisma.offer.findUnique({
            where: offerWhereUniqueInput,
            include: { seller: { select: { id: true, displayName: true, avatarUrl: true } } },
        });
    }

    async update(params: {
        where: Prisma.OfferWhereUniqueInput;
        data: Prisma.OfferUpdateInput;
    }): Promise<Offer> {
        const { where, data } = params;
        return this.prisma.offer.update({
            data,
            where,
        });
    }

    async remove(where: Prisma.OfferWhereUniqueInput): Promise<Offer> {
        return this.prisma.offer.delete({
            where,
        });
    }
}
