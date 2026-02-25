import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddExerciseToWeekDto } from './dto/add-exerciseWeek.dto';
import { ExercisesWeekService } from './exercises-week.service';
import { AddSetDto } from './dto/add-set.dto';
import { UpdateSetWeekDto } from './dto/update-set.dto';

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

    @Get(':workoutId/exercises/:workoutExerciseWeekId')
    async getExercise(
        @Param('workoutId', ParseIntPipe) workoutId: number,
        @Param('workoutExerciseWeekId', ParseIntPipe)
        workoutExerciseWeekId: number,
        @Req() req,
    ) {
        return this.exercisesWeekService.getExerciseWeekById(
            workoutId,
            workoutExerciseWeekId,
            req.user.id,
        );
    }

    @Delete(':workoutId/exercises/:workoutExerciseWeekId')
    async removeExercise(
        @Param('workoutId', ParseIntPipe) workoutId: number,
        @Param('workoutExerciseWeekId', ParseIntPipe)
        workoutExerciseWeekId: number,
        @Req() req,
    ) {
        return this.exercisesWeekService.removeExerciseFromWeek(
            workoutId,
            workoutExerciseWeekId,
            req.user.id,
        );
    }

    @Post(':workoutId/exercises/:workoutExerciseWeekId/sets')
    async addSet(
        @Param('workoutId', ParseIntPipe) workoutId: number,
        @Param('workoutExerciseWeekId', ParseIntPipe)
        workoutExerciseWeekId: number,
        @Body() dto: AddSetDto,
        @Req() req,
    ) {
        return this.exercisesWeekService.addSetToExercise(
            workoutId,
            workoutExerciseWeekId,
            dto,
            req.user.id,
        );
    }

    @Patch(':workoutId/exercises/:workoutExerciseWeekId/sets/:setId')
    async updateSet(
        @Param('workoutId', ParseIntPipe) workoutId: number,
        @Param('workoutExerciseWeekId', ParseIntPipe)
        workoutExerciseWeekId: number,
        @Param('setId', ParseIntPipe) setId: number,
        @Body() dto: UpdateSetWeekDto,
        @Req() req,
    ) {
        return this.exercisesWeekService.updateSet(
            workoutId,
            workoutExerciseWeekId,
            setId,
            req.user.id,
            dto,
        );
    }

    @Delete(':workoutId/exercises/:workoutExerciseWeekId/sets/:setId')
    async removeSet(
        @Param('workoutId', ParseIntPipe) workoutId: number,
        @Param('workoutExerciseWeekId', ParseIntPipe)
        workoutExerciseWeekId: number,
        @Param('setId', ParseIntPipe) setId: number,
        @Req() req,
    ) {
        return this.exercisesWeekService.removeSetFromExercise(
            workoutId,
            workoutExerciseWeekId,
            setId,
            req.user.id,
        );
    }
}
