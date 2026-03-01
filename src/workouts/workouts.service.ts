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
    return this.prisma.$transaction(async (tx) => {
      const workout = await tx.workout.create({
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

      const firstWeek = await tx.workoutWeek.create({
        data: {
          workoutId: workout.id,
          weekIndex: 1,
        },
      });
      return {
        ...workout,
        firstWeek,
      };
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
        where: { id: workoutId, userId },
        include: {
            weeks: {
                orderBy: { weekIndex: 'asc' },
                include: {
                    exercises: {
                        orderBy: { orderIndex: 'asc' },
                        include: {
                            sets: { orderBy: { orderIndex: 'asc' } },
                            exercise: true,
                        },
                    },
                },
            },
        },
    });

    if (!workout) throw new NotFoundException('Workout not found');

    // Преобразуем вложенный объект exercise в "плоский" массив
    const weeks = workout.weeks.map((week) => ({
        id: week.id,
        weekIndex: week.weekIndex,
        createdAt: week.createdAt,
        exercises: week.exercises.map((we) => ({
            workoutExerciseWeekId: we.id,
            exerciseId: we.exerciseId,
            title: we.exercise.title,
            desc: we.exercise.desc,
            muscleGroup: we.exercise.muscleGroup,
            orderIndex: we.orderIndex,
            sets: we.sets,
        })),
    }));

    return {
        id: workout.id,
        userId: workout.userId,
        title: workout.title,
        desc: workout.desc,
        createdAt: workout.createdAt,
        updatedAt: workout.updatedAt,
        weeks,
        exercises: [],
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
