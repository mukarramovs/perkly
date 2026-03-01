import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { AuthGuard } from '@nestjs/passport';
import { DisputeStatus, Role } from '../common/enums';

@UseGuards(AuthGuard('jwt'))
@Controller('disputes')
export class DisputesController {
    constructor(private readonly disputesService: DisputesService) { }

    @Post()
    async create(
        @Request() req: any,
        @Body() body: { transactionId: string; reason: string }
    ) {
        return this.disputesService.create(body.transactionId, req.user.userId, body.reason);
    }

    @Get()
    async findAllForAdmin(@Request() req: any) {
        const user = req.user;
        if (user.role !== Role.ADMIN) {
            throw new ForbiddenException('Only admins can view all disputes');
        }
        return this.disputesService.findAllForAdmin();
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: any) {
        const dispute = await this.disputesService.findOne(id);
        const userId = req.user.userId;
        const userRole = req.user.role;

        // Access control: Buyer, Seller, or Admin
        if (userRole !== Role.ADMIN &&
            // @ts-ignore
            dispute.transaction.buyerId !== userId &&
            // @ts-ignore
            dispute.transaction.offer.sellerId !== userId) {
            throw new ForbiddenException('You do not have access to this dispute');
        }

        return dispute;
    }

    @Post(':id/messages')
    async addMessage(
        @Param('id') id: string,
        @Request() req: any,
        @Body() body: { text: string }
    ) {
        return this.disputesService.addMessage(id, req.user.userId, body.text);
    }

    @Patch(':id/resolve')
    async resolveDispute(
        @Param('id') id: string,
        @Request() req: any,
        @Body() body: { status: DisputeStatus.RESOLVED | DisputeStatus.CLOSED }
    ) {
        const dispute = await this.disputesService.findOne(id);
        const userId = req.user.userId;
        const userRole = req.user.role;

        // Only Admin or Seller can resolve
        // @ts-ignore
        if (userRole !== Role.ADMIN && dispute.transaction.offer.sellerId !== userId) {
            throw new ForbiddenException('Only admin or the seller can resolve the dispute');
        }

        return this.disputesService.resolveDispute(id, userId, body.status);
    }
}
