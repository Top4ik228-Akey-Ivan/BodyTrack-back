import { Body, Controller, Post, Res } from '@nestjs/common';
import { type Response } from 'express';
import { LlmService } from './llm.service';
import { AnalyzeDto } from './dto/analyze.dto';

@Controller('llm')
export class LlmController {
    constructor(private readonly llmService: LlmService) {}

    @Post('analyze')
    async analyze(@Body() dto: AnalyzeDto, @Res() res: Response) {
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        await this.llmService.streamAnalyze(
            dto.workoutId,
            dto.weeks,
            dto.userPrompt,
            (chunk) => {
                console.log(chunk);
                res.write(chunk);
            },
        );

        res.end();
    }
}
