// files/files.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { FileType } from '@prisma/client';

@Injectable()
export class FilesService {
  public readonly uploadPath = join(process.cwd(), 'uploads', 'posts');

  constructor() {
    // Создаем папку для загрузок, если ее нет
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return FileType.IMAGE;
    if (mimeType.startsWith('video/')) return FileType.VIDEO;
    return FileType.OTHER;
  }

  validateFile(file: Express.Multer.File) {
    // Максимальный размер файла - 10MB
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new BadRequestException('File size too large');
    }
  }

  generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    return `post_${timestamp}.${extension}`;
  }
}
