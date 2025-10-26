import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma.service';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async create(
    createPostDto: { text?: string; userId: number },
    file: Express.Multer.File,
  ) {
    // Проверяем существование пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: createPostDto.userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Валидируем файл
    this.filesService.validateFile(file);

    // Генерируем имя файла и сохраняем
    const fileName = this.filesService.generateFileName(file.originalname);
    const filePath = join(this.filesService.uploadPath, fileName);

    writeFileSync(filePath, file.buffer);

    const fileType = this.filesService.getFileType(file.mimetype);
    const fileUrl = `/uploads/posts/${fileName}`;

    return await this.prisma.post.create({
      data: {
        text: createPostDto.text,
        userId: createPostDto.userId,
        file: {
          create: {
            url: fileUrl,
            type: fileType,
          },
        },
      },
      include: {
        file: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async getAll() {
    return await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        file: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async delete(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { file: true },
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId)
      throw new ForbiddenException('You can delete only your posts');

    // 🧹 Удаляем файл
    const fileUrl = post.file?.url;
    if (fileUrl) {
      // удаляем ведущие слеши, чтобы join работал корректно
      const relativePath = fileUrl.replace(/^\/+/, '');
      const filePath = join(process.cwd(), relativePath as string);

      try {
        if (existsSync(filePath)) {
          unlinkSync(filePath);
          console.log('✅ Deleted file:', filePath);
        } else {
          console.warn('⚠️ File not found on disk:', filePath);
        }
      } catch (e) {
        console.error('❌ Failed to delete file:', e);
      }
    }

    await this.prisma.post.delete({ where: { id } });

    return { message: 'Post and file deleted successfully' };
  }
}
