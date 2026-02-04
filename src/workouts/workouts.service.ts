import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getMyWorkouts(userId: number) {
    return await this.prisma.workout.findMany({
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
        createdAt: true,
      },
    });
  }

  async getWorkoutById(workoutId: number, userId: number) {
    const workout = await this.prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
      },
      select: {
        id: true,
        title: true,
        desc: true,
        createdAt: true,
        exercises: {
          orderBy: {
            orderIndex: 'asc',
          },
          select: {
            orderIndex: true,
            exercise: {
              select: {
                id: true,
                title: true,
                desc: true,
                muscleGroup: true,
              },
            },
            sets: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                weight: true,
                reps: true,
                orderIndex: true,
              },
            },
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    return {
      ...workout,
      exercises: workout.exercises.map((we) => ({
        exerciseId: we.exercise.id,
        title: we.exercise.title,
        desc: we.exercise.desc,
        muscleGroup: we.exercise.muscleGroup,
        orderIndex: we.orderIndex,
        sets: we.sets,
      })),
    };
  }

  async deleteWorkout(workoutId: number, userId: number) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (workout.userId !== userId) {
      throw new ForbiddenException('You cannot delete this workout');
    }

    await this.prisma.workout.delete({
      where: { id: workoutId },
    });

    return { success: true };
  }
}
