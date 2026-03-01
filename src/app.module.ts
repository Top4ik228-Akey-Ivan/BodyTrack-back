import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { FilesService } from './files/files.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WorkoutsModule } from './workouts/workouts.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ExercisesWeekModule } from './exercises-week/exercises-week.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // <-- путь к папке с файлами
      serveRoot: '/uploads', // <-- URL-префикс
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    WorkoutsModule,
    ExercisesModule,
    ExercisesWeekModule,
  ],
  controllers: [],
  providers: [FilesService],
})
export class AppModule {}
