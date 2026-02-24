import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddExerciseToWeekDto } from './dto/add-exerciseWeek.dto';

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
}
