import { IsInt, Min } from 'class-validator';

export class CreateWorkoutWeekDto {
  @IsInt()
  @Min(1)
  weekIndex: number;
}
