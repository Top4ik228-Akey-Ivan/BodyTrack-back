import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddExerciseToWorkoutDto } from './dto/add-exercise-to-workout.dto';
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';

@Injectable()
export class WorkoutExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  async addExerciseToWorkout(
    workoutId: number,
    dto: AddExerciseToWorkoutDto,
    userId: number,
  ) {
    // Проверяем, что тренировка существует и принадлежит пользователю
    const workout = await this.prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
      },
      select: { id: true },
    });

    if (!workout) {
      throw new ForbiddenException(
        'Нет доступа к тренировке или тренировка не существует',
      );
    }

    // Проверяем, что упражнение существует и тоже принадлежит пользователю
    const exercise = await this.prisma.exercise.findFirst({
      where: {
        id: dto.exerciseId,
        userId,
      },
      select: { id: true },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    // Создаём связь
    return this.prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseId: dto.exerciseId,
        orderIndex: dto.orderIndex,
      },
      select: {
        id: true,
        orderIndex: true,
        exercise: {
          select: {
            id: true,
            title: true,
            desc: true,
            muscleGroup: true,
          },
        },
      },
    });
  }

  async getWorkoutExerciseById(
    workoutId: number,
    workoutExerciseId: number,
    userId: number,
  ) {
    const workoutExercise = await this.prisma.workoutExercise.findFirst({
      where: {
        id: workoutExerciseId,
        workoutId,
        workout: {
          userId,
        },
      },
      select: {
        exercise: {
          select: {
            title: true,
            desc: true,
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
    });

    if (!workoutExercise) {
      throw new NotFoundException('WorkoutExercise not found');
    }

    return {
      title: workoutExercise.exercise.title,
      desc: workoutExercise.exercise.desc,
      sets: workoutExercise.sets,
    };
  }

  async deleteWorkoutExercise(
    workoutId: number,
    workoutExerciseId: number,
    userId: number,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const workoutExercise = await tx.workoutExercise.findFirst({
        where: {
          id: workoutExerciseId,
          workoutId,
          workout: { userId },
        },
      });

      if (!workoutExercise) {
        throw new NotFoundException('WorkoutExercise not found');
      }

      // удаляем
      await tx.workoutExercise.delete({
        where: { id: workoutExerciseId },
      });

      // получаем оставшиеся упражнения
      const exercises = await tx.workoutExercise.findMany({
        where: { workoutId },
        orderBy: { orderIndex: 'asc' },
      });

      // пересчитываем индексы
      for (let i = 0; i < exercises.length; i++) {
        await tx.workoutExercise.update({
          where: { id: exercises[i].id },
          data: { orderIndex: i + 1 },
        });
      }

      return { success: true };
    });
  }

  async createSet(
    workoutExerciseId: number,
    dto: CreateSetDto,
    userId: number,
  ) {
    // Проверяем, что упражнение в тренировке существует
    // и что тренировка принадлежит пользователю
    const workoutExercise = await this.prisma.workoutExercise.findFirst({
      where: {
        id: workoutExerciseId,
        workout: {
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!workoutExercise) {
      throw new ForbiddenException('Нет доступа к упражнению в тренировке');
    }

    // Создаём подход
    return this.prisma.set.create({
      data: {
        workoutExerciseId,
        weight: dto.weight,
        reps: dto.reps,
        orderIndex: dto.orderIndex,
      },
      select: {
        id: true,
        weight: true,
        reps: true,
        orderIndex: true,
      },
    });
  }

  async updateSet(
    workoutExerciseId: number,
    setId: number,
    dto: UpdateSetDto,
    userId: number,
  ) {
    const set = await this.prisma.set.findFirst({
      where: {
        id: setId,
        workoutExerciseId,
        workoutExercise: {
          workout: {
            userId,
          },
        },
      },
      select: { id: true },
    });

    if (!set) {
      throw new ForbiddenException('Нет доступа к подходу');
    }

    return this.prisma.set.update({
      where: { id: setId },
      data: {
        ...(dto.weight !== undefined && { weight: dto.weight }),
        ...(dto.reps !== undefined && { reps: dto.reps }),
      },
      select: {
        id: true,
        weight: true,
        reps: true,
        orderIndex: true,
      },
    });
  }

  async deleteSet(workoutExerciseId: number, setId: number, userId: number) {
    const set = await this.prisma.set.findFirst({
      where: {
        id: setId,
        workoutExerciseId,
        workoutExercise: {
          workout: {
            userId,
          },
        },
      },
      select: { id: true },
    });

    if (!set) {
      throw new ForbiddenException('Нет доступа к подходу');
    }

    return this.prisma.set.delete({
      where: {
        id: setId,
      },
    });
  }
}
