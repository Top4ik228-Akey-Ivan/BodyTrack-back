// src/workouts/workouts.controller.ts
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workouts.dto';

@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post('')
  async create(@Body() createWorkoutDto: CreateWorkoutDto, @Request() req) {
    const userId = req.user.id;

    return this.workoutsService.create({
      ...createWorkoutDto,
      userId,
    });
  }
}
