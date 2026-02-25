import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddExerciseToWeekDto } from './dto/add-exerciseWeek.dto';
import { AddSetDto } from './dto/add-set.dto';
import { UpdateSetWeekDto } from './dto/update-set.dto';

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

    async getExerciseWeekById(
        workoutId: number,
        workoutExerciseWeekId: number,
        userId: number,
    ) {
        const workoutExercise =
            await this.prisma.workoutExerciseWeek.findFirst({
                where: {
                    id: workoutExerciseWeekId,
                    workoutWeek: {
                        workoutId,
                        workout: { userId },
                    },
                },
                include: {
                    exercise: true,
                    sets: {
                        orderBy: { orderIndex: 'asc' },
                    },
                },
            });

        if (!workoutExercise) {
            throw new NotFoundException(
                'Упражнение недели не найдено',
            );
        }

        // Возвращаем "плоскую" структуру
        return {
            workoutExerciseWeekId: workoutExercise.id,
            exerciseId: workoutExercise.exerciseId,
            title: workoutExercise.exercise.title,
            desc: workoutExercise.exercise.desc,
            muscleGroup: workoutExercise.exercise.muscleGroup,
            orderIndex: workoutExercise.orderIndex,
            sets: workoutExercise.sets,
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

    async updateSet(
        workoutId: number,
        workoutExerciseWeekId: number,
        setId: number,
        userId: number,
        dto: UpdateSetWeekDto,
    ) {
        if (dto.weight === undefined && dto.reps === undefined) {
            throw new BadRequestException(
                'Нужно передать weight или reps',
            );
        }

        const set = await this.prisma.setWeek.findFirst({
            where: {
                id: setId,
                workoutExerciseWeekId,
                workoutExerciseWeek: {
                    workoutWeek: {
                        workoutId,
                        workout: { userId },
                    },
                },
            },
        });

        if (!set) {
            throw new NotFoundException('Подход не найден');
        }

        const updated = await this.prisma.setWeek.update({
            where: { id: setId },
            data: {
                ...(dto.weight !== undefined && { weight: dto.weight }),
                ...(dto.reps !== undefined && { reps: dto.reps }),
            },
        });

        return updated;
    }

    async removeSetFromExercise(
        workoutId: number,
        workoutExerciseWeekId: number,
        setId: number,
        userId: number,
    ) {
        // Проверяем, что подход существует и принадлежит пользователю
        const set = await this.prisma.setWeek.findFirst({
            where: {
                id: setId,
                workoutExerciseWeekId,
                workoutExerciseWeek: {
                    workoutWeek: {
                        workoutId,
                        workout: { userId },
                    },
                },
            },
        });

        if (!set) {
            throw new NotFoundException('Подход не найден');
        }

        // Удаляем
        await this.prisma.setWeek.delete({
            where: { id: setId },
        });

        // Реиндексация оставшихся подходов
        const remainingSets = await this.prisma.setWeek.findMany({
            where: { workoutExerciseWeekId },
            orderBy: { orderIndex: 'asc' },
        });

        await Promise.all(
            remainingSets.map((s, index) =>
                this.prisma.setWeek.update({
                    where: { id: s.id },
                    data: { orderIndex: index + 1 },
                }),
            ),
        );

        return { message: 'Подход удалён' };
    }
}
