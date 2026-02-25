import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddExerciseToWeekDto } from './dto/add-exerciseWeek.dto';
import { AddSetDto } from './dto/add-set.dto';

@Injectable()
export class ExercisesWeekService {
    constructor(private readonly prisma: PrismaService) { }

    async addExerciseToWeek(
        workoutId: number,
        dto: AddExerciseToWeekDto,
        userId: number,
    ) {
        // Находим неделю
        const week = await this.prisma.workoutWeek.findFirst({
            where: { workoutId, weekIndex: dto.weekIndex, workout: { userId } },
        });
        if (!week) throw new NotFoundException('Неделя не найдена');

        // Проверяем упражнение
        const exercise = await this.prisma.exercise.findFirst({
            where: { id: dto.exerciseId, userId },
        });
        if (!exercise) throw new NotFoundException('Упражнение не найдено');

        // Создаём WorkoutExerciseWeek (без SetWeek)
        const workoutExerciseWeek = await this.prisma.workoutExerciseWeek.create({
            data: {
                workoutWeekId: week.id,
                exerciseId: exercise.id,
                orderIndex: dto.orderIndex,
            },
        });

        return {
            workoutExerciseWeekId: workoutExerciseWeek.id,
            exerciseId: exercise.id,
            title: exercise.title,
            desc: exercise.desc,
            muscleGroup: exercise.muscleGroup,
            orderIndex: workoutExerciseWeek.orderIndex,
            sets: [],
        };
    }

    async removeExerciseFromWeek(
        workoutId: number,
        workoutExerciseWeekId: number,
        userId: number,
    ) {
        // Проверяем, что упражнение существует и принадлежит пользователю
        const workoutExercise =
            await this.prisma.workoutExerciseWeek.findFirst({
                where: {
                    id: workoutExerciseWeekId,
                    workoutWeek: {
                        workoutId,
                        workout: { userId },
                    },
                },
            });

        if (!workoutExercise) {
            throw new NotFoundException(
                'Упражнение в этой неделе не найдено',
            );
        }

        // Удаляем (если у тебя onDelete: Cascade, подходы удалятся сами)
        await this.prisma.workoutExerciseWeek.delete({
            where: { id: workoutExerciseWeekId },
        });

        return { message: 'Упражнение удалено' };
    }

    async addSetToExercise(
        workoutId: number,
        workoutExerciseWeekId: number,
        dto: AddSetDto,
        userId: number,
    ) {
        // Проверяем что упражнение существует и принадлежит пользователю
        const workoutExercise =
            await this.prisma.workoutExerciseWeek.findFirst({
                where: {
                    id: workoutExerciseWeekId,
                    workoutWeek: {
                        workoutId,
                        workout: { userId },
                    },
                },
            });

        if (!workoutExercise) {
            throw new NotFoundException(
                'Упражнение недели не найдено',
            );
        }

        // Создаём подход
        const set = await this.prisma.setWeek.create({
            data: {
                workoutExerciseWeekId,
                reps: dto.reps,
                weight: dto.weight,
                orderIndex: dto.orderIndex,
            },
        });

        return set;
    }
}
