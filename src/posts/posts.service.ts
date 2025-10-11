import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma.service';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createPostDto: CreatePostDto) {
    try {
      const post = await this.prisma.post.create({
        data: {
          text: createPostDto.text,
          userId: userId,
          files: {
            create: createPostDto.files,
          },
        },
        select: {
          id: true,
          text: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          files: {
            select: {
              id: true,
              url: true,
              type: true,
            },
          },
        },
      });
      return post as PostResponseDto;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Не удалось создать пост');
    }
  }

  async remove(postId: number, userId: number) {
    try {
      // Сначала находим пост чтобы проверить существование и владельца
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          userId: true,
        },
      });

      if (!post) {
        throw new NotFoundException('Пост не найден');
      }

      // Проверяем что пользователь является владельцем поста
      if (post.userId !== userId) {
        throw new ForbiddenException('Вы можете удалять только свои посты');
      }

      // Удаляем пост (каскадное удаление файлов должно быть настроено в Prisma)
      await this.prisma.post.delete({
        where: { id: postId },
      });

      return { message: 'Пост успешно удален' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      console.error('Post deletion error:', error);
      throw new BadRequestException('Не удалось удалить пост');
    }
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        files: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
