import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddExerciseToWeekDto } from './dto/add-exerciseWeek.dto';
import { ExercisesWeekService } from './exercises-week.service';

@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class ExercisesWeekController {
    constructor(private readonly exercisesWeekService: ExercisesWeekService) { }

    @Post(':workoutId/exercises')
    async addExercise(
        @Param('workoutId', ParseIntPipe) workoutId: number,
        @Body() dto: AddExerciseToWeekDto,
        @Req() req,
    ) {
        return this.exercisesWeekService.addExerciseToWeek(
            workoutId,
            dto,
            req.user.id,
        );
    }
}
