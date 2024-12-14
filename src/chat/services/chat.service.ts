import { Chat } from '@app/chat/entities/chat.entity';
import { CreateChatResponse } from '@app/chat/interfaces/create-chat-response.interface';
import { User } from '@app/user/entities/user.entity';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ChatService {
  private readonly MAX_USERS_IN_CHAT = 50;
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


async createChat(usersIds: string[]): Promise<CreateChatResponse> {
  if (usersIds.length === 0) {
    throw new BadRequestException('A chat must have at least one user.');
  }

  if (usersIds.length > this.MAX_USERS_IN_CHAT) {
    throw new BadRequestException(
      `A chat cannot have more than ${this.MAX_USERS_IN_CHAT} users.`,
    );
  }

  const users = await this.userRepository.findBy({ id: In(usersIds) });

  if (users.length !== usersIds.length) {
    throw new BadRequestException('Some user IDs are invalid.');
  }

  const chat = this.chatRepository.create({
    users,
  });

  const savedChat = await this.chatRepository.save(chat);

  const result = await this.chatRepository
    .createQueryBuilder('chat')
    .leftJoinAndSelect('chat.users', 'user')
    .select([
      'chat.id',
      'chat.createdAt',
      'chat.updatedAt',
      'user.id',
      'user.name',
      'user.username',
    ])
    .where('chat.id = :chatId', { chatId: savedChat.id })
    .getOne();

  return result;
}

  async getChat(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'user')
      .select([
        'chat.id',
        'chat.createdAt',
        'chat.updatedAt',
        'user.id',
        'user.name',
        'user.username',
      ])
      .where('chat.id = :chatId', { chatId })
      .getOne();

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found.`);
    }

    return chat;
  }

async getAllChats(): Promise<Chat[]> {
  const chats = await this.chatRepository
    .createQueryBuilder('chat')
    .leftJoinAndSelect('chat.users', 'user')
    .select([
      'chat.id',
      'chat.createdAt',
      'chat.updatedAt',
      'user.id',
      'user.name',
      'user.username',
    ])
    .getMany();

  return chats;
}


  async findChatByUserId(userId: string): Promise<Chat> {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!chat) {
      throw new NotFoundException(`No chat found for user ID ${userId}.`);
    }

    return chat;
  }


  async deleteChat(chatId: string): Promise<boolean> {
    const result = await this.chatRepository.delete(chatId);

    if (result.affected === 0) {
      throw new NotFoundException(`Chat with ID ${chatId} not found.`);
    }

    return true;
  }
}
