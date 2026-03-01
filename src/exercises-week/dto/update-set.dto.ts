import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateSetWeekDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    weight?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    reps?: number;
}
