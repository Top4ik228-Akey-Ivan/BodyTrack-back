import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from 'src/prisma.service';
import { analyzePrompt } from './prompts/analyze.prompt';

@Injectable()
export class LlmService {
    private client: OpenAI;

    constructor(private readonly prisma: PrismaService) {
        this.client = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: 'http://localhost:11434/v1',
        });
    }

    async getWorkoutData(workoutId: number, weeksCount: number) {
        const weeks = await this.prisma.workoutWeek.findMany({
            where: { workoutId },
            orderBy: {
                weekIndex: 'desc',
            },
            take: weeksCount,
            include: {
                exercises: {
                    include: {
                        exercise: true,
                        sets: true,
                    },
                },
            },
        });

        // Сортируем недели от старых к новым (хронологический порядок)
        const orderedWeeks = weeks.reverse();

        if (orderedWeeks.length === 0) {
            return { periodWeeksCount: 0, exercises: [] };
        }

        // Временный массив для сбора истории весов по каждому упражнению
        const exercisesHistory: {
            id: number;
            title: string;
            maxWeights: number[];
        }[] = [];

        // Проходим по всем неделям и собираем максимальные веса
        orderedWeeks.forEach((week) => {
            week.exercises.forEach((ex) => {
                const exerciseId = ex.exercise.id;

                // Находим максимальный вес на текущей неделе
                const weights = ex.sets.map((s) => s.weight ?? 0);
                const maxWeightThisWeek =
                    weights.length > 0 ? Math.max(...weights) : 0;

                // Ищем, добавляли ли мы уже это упражнение в наш массив истории
                let existingExercise = exercisesHistory.find(
                    (item) => item.id === exerciseId,
                );

                if (!existingExercise) {
                    // Если упражнение встретилось впервые, создаем для него запись
                    existingExercise = {
                        id: exerciseId,
                        title: ex.exercise.title,
                        maxWeights: [],
                    };
                    exercisesHistory.push(existingExercise);
                }

                // Добавляем максимальный вес этой недели в историю упражнения
                existingExercise.maxWeights.push(maxWeightThisWeek);
            });
        });

        // Формируем финальный плоский JSON строго по вашему шаблону
        const preparedExercises = exercisesHistory.map((ex, index) => {
            const startMax = ex.maxWeights[0] || 0;
            const finalMax = ex.maxWeights[ex.maxWeights.length - 1] || 0;
            const diff = finalMax - startMax;

            let status = 'плато';
            if (diff > 0) status = 'прогресс';
            if (diff < 0) status = 'спад';

            const data = {
                id: index + 1,
                title: ex.title,
                startMaxWeight: startMax,
                finalMaxWeight: finalMax,
                weightDifference: diff,
                status: status,
            };
            return data;
        });

        return {
            periodWeeksCount: orderedWeeks.length,
            exercises: preparedExercises,
        };
    }

    async streamAnalyze(
        workoutId: number,
        weeksCount: number,
        userPrompt: string | null,
        onChunk: (text: string) => void,
    ) {
        try {
            const workoutData = await this.getWorkoutData(
                workoutId,
                weeksCount,
            );

            const payload = {
                workoutData,
                userFeedback: userPrompt || null,
            };

            console.log(JSON.stringify(payload, null, 2));

            const stream = await this.client.chat.completions.create({
                model: 'llama3.1:8b',
                temperature: 0.4,
                stream: true,

                messages: [
                    {
                        role: 'system',
                        content: analyzePrompt,
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(payload),
                    },
                ],
            });

            for await (const chunk of stream) {
                const text = chunk.choices?.[0]?.delta?.content || '';

                if (text) {
                    onChunk(text);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}
