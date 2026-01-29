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

export interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async create(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken } = await this.authService.register(dto);
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: false, // HTTPS только в проде
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24,
    });

    console.log('[AUTH] set-cookie headers:', res.getHeaders()['set-cookie']);
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
      secure: false, // HTTPS только в проде
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24,
    });

    console.log('[AUTH] set-cookie headers:', res.getHeaders()['set-cookie']);
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
