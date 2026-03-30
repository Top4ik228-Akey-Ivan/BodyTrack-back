import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
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

    @Get('')
    async getMyWorkouts(@Request() req) {
        return await this.workoutsService.getMyWorkouts(req.user.id as number);
    }

    @Get(':id')
    async getWorkoutById(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ) {
        return await this.workoutsService.getWorkoutById(
            id,
            req.user.id as number,
        );
    }

    @Delete(':id')
    async deleteWorkout(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return await this.workoutsService.deleteWorkout(
            id,
            req.user.id as number,
        );
    }
}
