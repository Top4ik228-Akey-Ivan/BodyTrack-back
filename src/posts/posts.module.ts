import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [AuthModule],
  providers: [PostsService, PrismaService, FilesService],
  controllers: [PostsController],
})
export class PostsModule {}
