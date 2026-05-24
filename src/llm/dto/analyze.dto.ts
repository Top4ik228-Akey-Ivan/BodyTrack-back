import { IsInt, IsString } from 'class-validator';

export class AnalyzeDto {
    @IsInt()
    workoutId: number;
    @IsInt()
    weeks: number;
    @IsString()
    userPrompt: string | null;
}
