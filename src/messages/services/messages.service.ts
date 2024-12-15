import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Chat } from '@app/chat/entities/chat.entity';
import { User } from '@app/user/entities/user.entity';
import { formatUser } from '@app/common/utils/format-user.util';
import { CreateMessageResponse } from '@app/messages/interfaces/create-message-response.interface';
import { GetMessageResponse } from '../interfaces/get-message-response.interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createMessage(
    senderId: string,
    chatId: string,
    content: string,
  ): Promise<CreateMessageResponse> {
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    if (!sender) {
      throw new BadRequestException(`Sender with ID ${senderId} not found.`);
    }

    const chat = await this.chatRepository.findOne({ where: { id: chatId } });
    if (!chat) {
      throw new BadRequestException(`Chat with ID ${chatId} not found.`);
    }

    const newMessage = this.messageRepository.create({
      senderId,
      chatId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedMessage = await this.messageRepository.save(newMessage);

    return {
      id: savedMessage.id,
      content: savedMessage.content,
      chatId: savedMessage.chatId,
      createdAt: savedMessage.createdAt,
      updatedAt: savedMessage.updatedAt,
      sender: formatUser(sender),
    };
  }

  async getMessageById(messageId: string): Promise<GetMessageResponse> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender', 'chat'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found.`);
    }

    return this.formatMessageResponse(message);
  }

  async getMessagesBySenderId(senderId: string): Promise<GetMessageResponse[]> {
    const messages = await this.messageRepository.find({
      where: { senderId },
      relations: ['chat'],
    });

    if (messages.length === 0) {
      throw new NotFoundException(
        `No messages found for sender ID ${senderId}.`,
      );
    }

    return messages.map(this.formatMessageResponse);
  }

  async getMessagesByChatId(chatId: string): Promise<GetMessageResponse[]> {
    const messages = await this.messageRepository.find({
      where: { chatId },
      relations: ['sender'], // Optionally include sender details
    });

    if (messages.length === 0) {
      throw new NotFoundException(`No messages found for chat ID ${chatId}.`);
    }

    return messages.map(this.formatMessageResponse);
  }

  async getAllMessages(): Promise<GetMessageResponse[]> {
    const messages = await this.messageRepository.find({
      relations: ['sender', 'chat'], // Include sender and chat relations
    });

    return messages.map(this.formatMessageResponse);
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    const result = await this.messageRepository.delete(messageId);
    if (result.affected === 0) {
      throw new NotFoundException(`Message with ID ${messageId} not found.`);
    }
    return true;
  }

  private formatMessageResponse(message: Message): GetMessageResponse {
    return {
      id: message.id,
      senderId: message.senderId,
      chatId: message.chatId,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
