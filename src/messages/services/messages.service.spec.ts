import { Chat } from '@app/chat/entities/chat.entity';
import { Message } from '@app/messages/entities/message.entity';
import { MessagesService } from '@app/messages/services/messages.service';
import { User } from '@app/user/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

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

  describe('getMessagesBySenderId', () => {
    it('should return messages successfully', async () => {
      const senderId = 'user-1';
      const sender = { id: senderId } as User;
      const chat = { id: 'chat-1' } as Chat;
      const messages = [
        {
          id: 'message-1',
          sender,
          chat,
          content: 'Hello',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'message-2',
          sender,
          chat,
          content: 'Hi',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as Message[];

      jest.spyOn(messageRepository, 'find').mockResolvedValue(messages);

      const result = await service.getMessagesBySenderId(senderId);
      expect(result).toEqual([
        {
          id: 'message-1',
          senderId: senderId,
          chatId: 'chat-1',
          content: 'Hello',
          createdAt: messages[0].createdAt,
          updatedAt: messages[0].updatedAt,
        },
        {
          id: 'message-2',
          senderId: senderId,
          chatId: 'chat-1',
          content: 'Hi',
          createdAt: messages[1].createdAt,
          updatedAt: messages[1].updatedAt,
        },
      ]);
    });

    it('should throw NotFoundException if no messages found', async () => {
      const senderId = 'user-1';

      jest.spyOn(messageRepository, 'find').mockResolvedValue([]);

      await expect(service.getMessagesBySenderId(senderId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getMessagesByChatId', () => {
    it('should return messages successfully', async () => {
      const chatId = 'chat-1';
      const sender = { id: 'user-1' } as User;
      const chat = { id: chatId } as Chat;
      const messages = [
        {
          id: 'message-1',
          sender,
          chat,
          content: 'Hello',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'message-2',
          sender,
          chat,
          content: 'Hi',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as Message[];

      jest.spyOn(messageRepository, 'find').mockResolvedValue(messages);

      const result = await service.getMessagesByChatId(chatId);
      expect(result).toEqual([
        {
          id: 'message-1',
          senderId: 'user-1',
          chatId: chatId,
          content: 'Hello',
          createdAt: messages[0].createdAt,
          updatedAt: messages[0].updatedAt,
        },
        {
          id: 'message-2',
          senderId: 'user-1',
          chatId: chatId,
          content: 'Hi',
          createdAt: messages[1].createdAt,
          updatedAt: messages[1].updatedAt,
        },
      ]);
    });

    it('should throw NotFoundException if no messages found', async () => {
      const chatId = 'chat-1';

      jest.spyOn(messageRepository, 'find').mockResolvedValue([]);

      await expect(service.getMessagesByChatId(chatId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllMessages', () => {
    it('should return all messages successfully', async () => {
      const sender = { id: 'user-1' } as User;
      const chat = { id: 'chat-1' } as Chat;
      const messages = [
        {
          id: 'message-1',
          sender,
          chat,
          content: 'Hello',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'message-2',
          sender,
          chat,
          content: 'Hi',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as Message[];

      jest.spyOn(messageRepository, 'find').mockResolvedValue(messages);

      const result = await service.getAllMessages();
      expect(result).toEqual([
        {
          id: 'message-1',
          senderId: 'user-1',
          chatId: 'chat-1',
          content: 'Hello',
          createdAt: messages[0].createdAt,
          updatedAt: messages[0].updatedAt,
        },
        {
          id: 'message-2',
          senderId: 'user-1',
          chatId: 'chat-1',
          content: 'Hi',
          createdAt: messages[1].createdAt,
          updatedAt: messages[1].updatedAt,
        },
      ]);
    });
  });

  describe('deleteMessage', () => {
    const mockDeleteResult = (affected: number): DeleteResult => ({
      raw: {},
      affected,
    });

    it('should delete a message successfully', async () => {
      const messageId = 'message-1';

      jest
        .spyOn(messageRepository, 'delete')
        .mockResolvedValue(mockDeleteResult(1));

      const result = await service.deleteMessage(messageId);
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if message not found', async () => {
      const messageId = 'message-1';

      jest
        .spyOn(messageRepository, 'delete')
        .mockResolvedValue(mockDeleteResult(0));

      await expect(service.deleteMessage(messageId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
