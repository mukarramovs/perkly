import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { Prisma, Offer } from '@prisma/client';

@Controller('offers')
export class OffersController {
    constructor(private readonly offersService: OffersService) { }

    @Post()
    create(@Body() createOfferDto: Prisma.OfferCreateInput): Promise<Offer> {
        return this.offersService.create(createOfferDto);
    }

    @Get()
    findAll(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('category') category?: string,
        @Query('search') search?: string,
        @Query('sort') sort?: string,
        @Query('isFlashDrop') isFlashDrop?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
    ): Promise<{ data: Offer[]; total: number }> {
        return this.offersService.findAllFiltered({
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            category,
            search,
            sort,
            isFlashDrop: isFlashDrop === 'true' ? true : isFlashDrop === 'false' ? false : undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Offer | null> {
        return this.offersService.findOne({ id });
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateOfferDto: Prisma.OfferUpdateInput,
    ): Promise<Offer> {
        return this.offersService.update({
            where: { id },
            data: updateOfferDto,
        });
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<Offer> {
        return this.offersService.remove({ id });
    }
}
