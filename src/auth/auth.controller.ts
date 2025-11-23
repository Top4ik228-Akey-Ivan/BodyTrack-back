import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  create(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
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
    return { user };
  }
}
