import { Chat } from '@app/chat/entities/chat.entity';
import { Message } from '@app/messages/entities/message.entity';
import { MessagesService } from '@app/messages/services/messages.service';
import { User } from '@app/user/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('MessagesService', () => {
  let service: MessagesService;
  let messageRepository: Repository<Message>;
  let chatRepository: Repository<Chat>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Chat),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    messageRepository = module.get<Repository<Message>>(
      getRepositoryToken(Message),
    );
    chatRepository = module.get<Repository<Chat>>(getRepositoryToken(Chat));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createMessage', () => {
    it('should create and return a message successfully', async () => {
      const senderId = 'user-1';
      const chatId = 'chat-1';
      const content = 'Hello World';

      const sender = { id: senderId } as User;
      const chat = { id: chatId, users: [{ id: senderId }] } as unknown as Chat;
      const newMessage = {
        id: 'message-1',
        sender,
        chat,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Message;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(sender);
      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(chat);
      jest.spyOn(messageRepository, 'create').mockReturnValue(newMessage);
      jest.spyOn(messageRepository, 'save').mockResolvedValue(newMessage);

      const result = await service.createMessage(senderId, chatId, content);
      expect(result).toEqual({
        id: 'message-1',
        senderId: senderId,
        chatId: chatId,
        content: content,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
      });
    });

    it('should throw BadRequestException if sender not found', async () => {
      const senderId = 'user-1';
      const chatId = 'chat-1';
      const content = 'Hello World';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.createMessage(senderId, chatId, content),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if chat not found', async () => {
      const senderId = 'user-1';
      const chatId = 'chat-1';
      const content = 'Hello World';

      const sender = { id: senderId } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(sender);
      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.createMessage(senderId, chatId, content),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if sender is not part of the chat', async () => {
      const senderId = 'user-1';
      const chatId = 'chat-1';
      const content = 'Hello World';

      const sender = { id: senderId } as User;
      const chat = { id: chatId, users: [{ id: 'user-2' }] } as unknown as Chat;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(sender);
      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(chat);

      await expect(
        service.createMessage(senderId, chatId, content),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMessageById', () => {
    it('should return a message successfully', async () => {
      const messageId = 'message-1';
      const sender = { id: 'user-1' } as User;
      const chat = { id: 'chat-1' } as Chat;
      const message = {
        id: messageId,
        sender,
        chat,
        content: 'Hello',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Message;

      jest.spyOn(messageRepository, 'findOne').mockResolvedValue(message);

      const result = await service.getMessageById(messageId);
      expect(result).toEqual({
        id: messageId,
        senderId: 'user-1',
        chatId: 'chat-1',
        content: 'Hello',
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      });
    });

    it('should throw NotFoundException if message not found', async () => {
      const messageId = 'message-1';

      jest.spyOn(messageRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getMessageById(messageId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
