import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getMe(@Request() req: any) {
        return this.usersService.findById(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    async updateMe(
        @Request() req: any,
        @Body() body: { displayName?: string; avatarUrl?: string },
    ) {
        return this.usersService.updateProfile(req.user.userId, body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me/stats')
    async getMyStats(@Request() req: any) {
        return this.usersService.getStats(req.user.userId);
    }
}
