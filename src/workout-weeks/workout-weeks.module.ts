import { Module } from '@nestjs/common';
import { WorkoutWeeksService } from './workout-weeks.service';
import { WorkoutWeeksController } from './workout-weeks.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [AuthModule],
  providers: [WorkoutWeeksService, PrismaService],
  controllers: [WorkoutWeeksController],
})
export class WorkoutWeeksModule {}
