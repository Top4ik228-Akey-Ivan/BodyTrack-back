import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { LlmGateway } from './llmGateway';

@Module({
    imports: [AuthModule],
    providers: [LlmService, LlmGateway, PrismaService],
    controllers: [LlmController],
})
export class LlmModule {}
