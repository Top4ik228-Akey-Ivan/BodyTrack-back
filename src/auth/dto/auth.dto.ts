import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @ApiProperty({ example: 'test@mail.com' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @ApiProperty({ example: 'qwerty' })
    password: string;
}

export class RegisterDto {
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @ApiProperty({ example: 'Ivan Krasiviy' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @ApiProperty({ example: 'test@mail.com' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @ApiProperty({ example: 'qwerty' })
    password: string;
}

export class RegisterResponseDto {
    id: number;
    email: string;
    name: string;
    avatarUrl?: string;
}

export class LoginResponseDto {
    user: RegisterResponseDto;
    token: string;
}
