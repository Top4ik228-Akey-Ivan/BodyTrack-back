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

        const orderedWeeks = weeks.reverse();

        const data = {
            weeks: orderedWeeks.map((week) => ({
                week: week.weekIndex,

                exercises: week.exercises.map((ex) => ({
                    id: ex.id,
                    title: ex.exercise.title,
                    sets: ex.sets.map((s) => ({
                        weight: s.weight,
                        reps: s.reps,
                    })),
                })),
            })),
        };

        return data;
    }
    async streamAnalyze(
        workoutId: number,
        weeksCount: number,
        onChunk: (text: string) => void,
    ) {
        try {
            const workoutData = await this.getWorkoutData(
                workoutId,
                weeksCount,
            );

            const stream = await this.client.chat.completions.create({
                model: 'llama3.1:8b',
                // model: 'openrouter/free',
                temperature: 0.3,
                stream: true,

                messages: [
                    {
                        role: 'system',
                        content: analyzePrompt,
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(workoutData),
                    },
                ],
            });

            let isThinking = false;
            for await (const chunk of stream) {
                const text = chunk.choices?.[0]?.delta?.content || '';

                if (text.includes('<think>')) {
                    isThinking = true;
                    continue;
                }
                if (text.includes('</think>')) {
                    isThinking = false;
                    continue;
                }

                if (text && !isThinking) {
                    onChunk(text);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}
