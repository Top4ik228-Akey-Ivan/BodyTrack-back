import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateSetDto {
  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  reps: number;

  @IsInt()
  @Min(1)
  orderIndex: number;
}
