/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  ParseIntPipe,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('')
  create(@Body() dto: CreatePostDto, @Request() req) {
    return this.postsService.create(req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) postId: number, @Request() req) {
    return this.postsService.remove(postId, req.user.id);
  }

  @Get('')
  findAll() {
    return this.postsService.findAll();
  }
}
