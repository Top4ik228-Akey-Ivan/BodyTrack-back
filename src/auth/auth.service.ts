import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto, LoginDto, RegisterResponseDto } from './dto/auth.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(dto.password, saltRounds);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                passwordHash,
            },
        });
        const payload = {
            userId: user.id,
            email: user.email,
        };
        const accessToken = this.jwtService.sign(payload);

        return {
            user: this.excludePassword(user),
            accessToken,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            userId: user.id,
            email: user.email,
        };
        const accessToken = this.jwtService.sign(payload);

        return {
            user: this.excludePassword(user),
            accessToken,
        };
    }

    me(user: User) {
        return this.excludePassword(user);
    }

    private excludePassword(user: any): RegisterResponseDto {
        const {
            passwordHash,
            createdAt,
            updatedAt,
            ...userWithoutSensitiveData
        } = user;
        return userWithoutSensitiveData as RegisterResponseDto;
    }
}
