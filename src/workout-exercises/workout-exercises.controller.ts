import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkoutExercisesService } from './workout-exercises.service';
import { AddExerciseToWorkoutDto } from './dto/add-exercise-to-workout.dto';
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';

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

  @Get(':workoutExerciseId')
  async getWorkoutExerciseById(
    @Param('workoutId') workoutId: string,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Request() req,
  ) {
    return await this.workoutExercisesService.getWorkoutExerciseById(
      Number(workoutId),
      Number(workoutExerciseId),
      req.user.id as number,
    );
  }

  @Post(':workoutExerciseId')
  async createSet(
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Body() dto: CreateSetDto,
    @Request() req,
  ) {
    return await this.workoutExercisesService.createSet(
      Number(workoutExerciseId),
      dto,
      req.user.id as number,
    );
  }

  @Delete(':workoutExerciseId')
  async deleteWorkoutExercise(
    @Param('workoutId') workoutId: string,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Request() req,
  ) {
    return await this.workoutExercisesService.deleteWorkoutExercise(
      Number(workoutId),
      Number(workoutExerciseId),
      req.user.id as number,
    );
  }

  @Patch(':workoutExerciseId/sets/:setId')
  async updateSet(
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Param('setId') setId: string,
    @Body() dto: UpdateSetDto,
    @Request() req,
  ) {
    return await this.workoutExercisesService.updateSet(
      Number(workoutExerciseId),
      Number(setId),
      dto,
      req.user.id as number,
    );
  }

  @Delete(':workoutExerciseId/sets/:setId')
  async deleteSet(
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Param('setId') setId: string,
    @Request() req,
  ) {
    return await this.workoutExercisesService.deleteSet(
      Number(workoutExerciseId),
      Number(setId),
      req.user.id as number,
    );
  }
}
