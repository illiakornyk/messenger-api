import { Module } from '@nestjs/common';
import { MessagesController } from './controllers/messages.controller';
import { MessagesService } from './services/messages.service';
import { Message } from '@app/messages/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '@app/chat/entities/chat.entity';
import { User } from '@app/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Message])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
