import {
    WebSocketGateway,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { LlmService } from './llm.service';

@WebSocketGateway({ cors: true })
export class LlmGateway {
    constructor(private readonly llmService: LlmService) {}

    handleConnection(client: Socket) {
        console.log('connected', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('disconnect', client.id);
    }

    @SubscribeMessage('startAnalyze')
    async handleAnalyze(
        @MessageBody() data: { workoutId: number; weeks: number },
        @ConnectedSocket() client: Socket,
    ) {
        console.log('start analyze');
        try {
            await this.llmService.streamAnalyze(
                data.workoutId,
                data.weeks,
                (chunk) => {
                    client.emit('chunk', chunk); // шлём чанки клиенту
                },
            );

            client.emit('done', 'Analysis complete');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            client.emit('error', 'Analyze failed');
        }
    }
}
