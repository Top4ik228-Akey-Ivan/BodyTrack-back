import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class AddSetDto {
    @IsInt()
    reps: number;
    @IsNumber()
    @IsOptional()
    weight?: number;
    @IsInt()
    orderIndex: number;
}
