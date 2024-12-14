import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { Chat } from '@app/chat/entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
