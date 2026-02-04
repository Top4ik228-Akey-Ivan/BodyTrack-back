import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkoutExercisesService } from './workout-exercises.service';
import { AddExerciseToWorkoutDto } from './dto/add-exercise-to-workout.dto';

@UseGuards(JwtAuthGuard)
@Controller('workouts/:workoutId/exercises')
export class WorkoutExercisesController {
  constructor(
    private readonly workoutExercisesService: WorkoutExercisesService,
  ) {}

  @Post('')
  async addExercise(
    @Param('workoutId') workoutId: string,
    @Body() dto: AddExerciseToWorkoutDto,
    @Request() req,
  ) {
    return this.workoutExercisesService.addExerciseToWorkout(
      Number(workoutId),
      dto,
      req.user.id as number,
    );
  }
}
