import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatGateway } from './chat.gateway.js';
import { ChatController } from './chat.controller.js';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}

