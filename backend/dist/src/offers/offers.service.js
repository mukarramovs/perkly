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
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OffersService = class OffersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.offer.create({ data });
    }
    async findAllFiltered(params) {
        const { skip = 0, take = 20, category, search, sort, isFlashDrop, minPrice, maxPrice } = params;
        const where = {
            isActive: true,
        };
        if (category) {
            where.category = category;
        }
        if (isFlashDrop !== undefined) {
            where.isFlashDrop = isFlashDrop;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        let orderBy = { createdAt: 'desc' };
        if (sort === 'price_asc')
            orderBy = { price: 'asc' };
        if (sort === 'price_desc')
            orderBy = { price: 'desc' };
        if (sort === 'newest')
            orderBy = { createdAt: 'desc' };
        if (sort === 'oldest')
            orderBy = { createdAt: 'asc' };
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
    async findAll(params) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.offer.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }
    async findOne(offerWhereUniqueInput) {
        return this.prisma.offer.findUnique({
            where: offerWhereUniqueInput,
            include: { seller: { select: { id: true, displayName: true, avatarUrl: true } } },
        });
    }
    async update(params) {
        const { where, data } = params;
        return this.prisma.offer.update({
            data,
            where,
        });
    }
    async remove(where) {
        return this.prisma.offer.delete({
            where,
        });
    }
};
exports.OffersService = OffersService;
exports.OffersService = OffersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OffersService);
//# sourceMappingURL=offers.service.js.map