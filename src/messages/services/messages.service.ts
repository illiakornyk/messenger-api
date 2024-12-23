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
import { IGetMessageResponse } from '../interfaces/get-message-response.interface';

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
  ): Promise<IGetMessageResponse> {
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    if (!sender) {
      throw new BadRequestException(`Sender with ID ${senderId} not found.`);
    }

    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['users'],
    });
    if (!chat) {
      throw new BadRequestException(`Chat with ID ${chatId} not found.`);
    }

    const isUserInChat = chat.users.some((user) => user.id === senderId);
    if (!isUserInChat) {
      throw new BadRequestException(
        `Sender with ID ${senderId} is not a participant in chat with ID ${chatId}.`,
      );
    }

    const newMessage = this.messageRepository.create({
      sender,
      chat,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedMessage = await this.messageRepository.save(newMessage);

    return this.formatMessageResponse(savedMessage);
  }

  async getMessageById(messageId: string): Promise<IGetMessageResponse> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender', 'chat'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found.`);
    }

    return this.formatMessageResponse(message);
  }

  async getMessagesBySenderId(
    senderId: string,
  ): Promise<IGetMessageResponse[]> {
    const messages = await this.messageRepository.find({
      where: { sender: { id: senderId } },
      relations: ['chat', 'sender'],
    });

    if (messages.length === 0) {
      throw new NotFoundException(
        `No messages found for sender ID ${senderId}.`,
      );
    }

    return messages.map(this.formatMessageResponse);
  }

  async getMessagesByChatId(chatId: string): Promise<IGetMessageResponse[]> {
    const messages = await this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ['chat', 'sender'],
    });

    if (messages.length === 0) {
      throw new NotFoundException(`No messages found for chat ID ${chatId}.`);
    }

    return messages.map(this.formatMessageResponse);
  }

  async getAllMessages(): Promise<IGetMessageResponse[]> {
    const messages = await this.messageRepository.find({
      relations: ['sender', 'chat'],
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

  private formatMessageResponse(message: Message): IGetMessageResponse {
    return {
      id: message.id,
      senderId: message.sender.id,
      chatId: message.chat.id,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
