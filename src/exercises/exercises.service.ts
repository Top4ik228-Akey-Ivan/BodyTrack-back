import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExerciseDto & { userId: number }) {
    return this.prisma.exercise.create({
      data: {
        title: dto.title,
        desc: dto.desc,
        muscleGroup: dto.muscleGroup,
        userId: dto.userId,
      },
      select: {
        id: true,
        title: true,
        desc: true,
        muscleGroup: true,
      },
    });
  }

  async getMyExercises(userId: number) {
    return this.prisma.exercise.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        desc: true,
        muscleGroup: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
