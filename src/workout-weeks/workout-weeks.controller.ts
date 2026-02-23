import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkoutWeeksService } from './workout-weeks.service';
import { CreateWorkoutWeekDto } from './dto/create-workoutWeek.dto';

@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutWeeksController {
  constructor(private readonly workoutWeeksService: WorkoutWeeksService) {}

  @Post(':workoutId/weeks')
  async createWeek(
    @Param('workoutId', ParseIntPipe) workoutId: number,
    @Body() dto: CreateWorkoutWeekDto,
    @Request() req,
  ) {
    return await this.workoutWeeksService.createWeek(
      workoutId,
      dto.weekIndex,
      req.user.id as number,
    );
  }

  @Get(':workoutId/weeks/:weekIndex')
  async getWeekDetails(
    @Param('workoutId', ParseIntPipe) workoutId: number,
    @Param('weekIndex', ParseIntPipe) weekIndex: number,
    @Req() req,
  ) {
    return await this.workoutWeeksService.getWorkoutWeek(
      workoutId,
      weekIndex,
      req.user.id as number,
    );
  }
}
