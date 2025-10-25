import { ForbiddenException, Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
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

    // Используем импортированный writeFileSync вместо require
    writeFileSync(filePath, file.buffer);

    const fileType = this.filesService.getFileType(file.mimetype);
    const fileUrl = `/uploads/${fileName}`;

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
}
