import { Module } from '@nestjs/common';
import { ExercisesWeekController } from './exercises-week.controller';
import { ExercisesWeekService } from './exercises-week.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [ExercisesWeekController],
  providers: [ExercisesWeekService, PrismaService],
})
export class ExercisesWeekModule {}
