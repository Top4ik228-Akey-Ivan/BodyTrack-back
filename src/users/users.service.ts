import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.user.findMany();
    // return [
    //   {
    //     id: 1,
    //     email: 'ivan@mail.com',
    //     name: 'Иван Иванов',
    //     avatarUrl: 'https://example.com/avatar1.jpg',
    //     passwordHash: '$2b$10$hashed_password_1',
    //     createdAt: '2024-01-15T10:00:00.000Z',
    //     updatedAt: '2024-01-15T10:00:00.000Z',
    //   },
    //   {
    //     id: 2,
    //     email: 'maria@mail.com',
    //     name: 'Мария Петрова',
    //     avatarUrl: 'https://example.com/avatar2.jpg',
    //     passwordHash: '$2b$10$hashed_password_2',
    //     createdAt: '2024-01-14T15:30:00.000Z',
    //     updatedAt: '2024-01-14T15:30:00.000Z',
    //   },
    // ];
  }
}
