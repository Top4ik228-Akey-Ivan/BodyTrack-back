import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MuscleGroup } from '@prisma/client';

export class CreateExerciseDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    desc?: string;

    @IsEnum(MuscleGroup)
    muscleGroup: MuscleGroup;
}
