import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddExerciseToWorkoutDto } from './dto/add-exercise-to-workout.dto';

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
}
