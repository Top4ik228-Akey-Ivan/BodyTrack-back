import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WorkoutWeeksService {
  constructor(private readonly prisma: PrismaService) {}

  async createWeek(workoutId: number, weekIndex: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      // Проверяем, что тренировка существует и принадлежит пользователю
      const workout = await tx.workout.findFirst({
        where: {
          id: workoutId,
          userId,
        },
        include: {
          exercises: {
            include: {
              sets: true,
            },
          },
        },
      });

      if (!workout) {
        throw new ForbiddenException(
          'Нет доступа к тренировке или тренировка не существует',
        );
      }

      // Создаём неделю
      const workoutWeek = await tx.workoutWeek.create({
        data: {
          workoutId,
          weekIndex,
        },
        select: {
          id: true,
          weekIndex: true,
          createdAt: true,
        },
      });

      // Копируем структуру шаблона в неделю
      for (const exercise of workout.exercises) {
        const workoutExerciseWeek = await tx.workoutExerciseWeek.create({
          data: {
            workoutWeekId: workoutWeek.id,
            workoutExerciseId: exercise.id,
          },
        });

        for (const set of exercise.sets) {
          await tx.setWeek.create({
            data: {
              workoutExerciseWeekId: workoutExerciseWeek.id,
              setId: set.id,
              weight: set.weight,
              reps: set.reps,
            },
          });
        }
      }

      return workoutWeek;
    });
  }

  async getWorkoutWeek(workoutId: number, weekIndex: number, userId: number) {
    const workoutWeek = await this.prisma.workoutWeek.findFirst({
      where: {
        workoutId,
        weekIndex,
        workout: {
          userId, // проверяем, что тренировка принадлежит пользователю
        },
      },
      include: {
        workout: {
          select: {
            id: true,
            title: true,
          },
        },
        exercises: {
          include: {
            workoutExercise: {
              select: {
                id: true,
                orderIndex: true,
                exercise: {
                  select: {
                    id: true,
                    title: true,
                    muscleGroup: true,
                    desc: true,
                  },
                },
              },
            },
            sets: {
              select: {
                id: true,
                weight: true,
                reps: true,
                set: {
                  select: {
                    id: true,
                    orderIndex: true,
                  },
                },
              },
            },
          },
          orderBy: {
            workoutExercise: {
              orderIndex: 'asc',
            },
          },
        },
      },
    });

    if (!workoutWeek) {
      throw new NotFoundException('Неделя не найдена или доступ запрещен');
    }

    return workoutWeek;
  }
}
