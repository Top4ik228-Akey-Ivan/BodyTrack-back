import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateSetDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reps?: number;
}
