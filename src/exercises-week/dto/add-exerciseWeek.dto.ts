import { IsInt } from 'class-validator';

export class AddExerciseToWeekDto {
    @IsInt()
    weekIndex: number;
    @IsInt()
    exerciseId: number;
    @IsInt()
    orderIndex: number;
}
