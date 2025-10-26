import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() CreatePostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req, // Получаем пользователя из JWT
  ) {
    // userId теперь берется из JWT токена
    const userId = req.user.id;

    const result = await this.postsService.create(
      {
        ...CreatePostDto,
        userId,
      },
      file,
    );
    return result;
  }

  @Get()
  async getAll() {
    return await this.postsService.getAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.postsService.delete(+id, userId);
  }
}
