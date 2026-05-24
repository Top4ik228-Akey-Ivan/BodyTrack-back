import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WorkoutsModule } from './workouts/workouts.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ExercisesWeekModule } from './exercises-week/exercises-week.module';
import { LlmModule } from './llm/llm.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'uploads'),
            serveRoot: '/uploads',
        }),
        UsersModule,
        AuthModule,
        WorkoutsModule,
        ExercisesModule,
        ExercisesWeekModule,
        LlmModule,
    ],
    controllers: [],
})
export class AppModule {}
