import { IsInt } from 'class-validator';

export class AnalyzeDto {
    @IsInt()
    workoutId: number;
    @IsInt()
    weeks: number;
}
