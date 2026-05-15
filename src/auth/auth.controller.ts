import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

export interface RequestWithUser extends Request {
    user: User;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Регистрация' })
    @Post('register')
    async create(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { user, accessToken } = await this.authService.register(dto);
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24,
        });
        return user;
    }

    @UsePipes(new ValidationPipe())
    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { user, accessToken } = await this.authService.login(dto);

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24,
        });
        return user;
    }

    @Get('me')
    @UseGuards(JwtAuthGuard) //
    me(@Request() req: RequestWithUser) {
        return this.authService.me(req.user);
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.cookie('token', '', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });
        return { message: 'Logged out' };
    }
}
