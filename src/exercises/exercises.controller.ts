import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post('')
  async create(@Body() dto: CreateExerciseDto, @Request() req) {
    const userId = req.user.id;

    return await this.exercisesService.create({
      ...dto,
      userId,
    });
  }

  @Get('')
  async getMyExercises(@Request() req) {
    return await this.exercisesService.getMyExercises(req.user.id as number);
  }
}
