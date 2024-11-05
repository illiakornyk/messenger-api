import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';

@Module({
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
