import { IsInt, Min } from 'class-validator';

export class AddExerciseToWorkoutDto {
  @IsInt()
  exerciseId: number;

  @IsInt()
  @Min(0)
  orderIndex: number;
}
