import { Injectable } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workouts.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWorkoutDto & { userId: number }) {
    return await this.prisma.workout.create({
      data: {
        title: dto.title,
        desc: dto.desc,
        userId: dto.userId,
      },
      select: {
        id: true,
        title: true,
        desc: true,
        createdAt: true,
      },
    });
  }
}
