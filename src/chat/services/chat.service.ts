import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Chat } from '../classes/chat.class';

@Injectable()
export class ChatService {
  private chats = new Map<string, Chat>();

  createChat(usersIds: string[]): Chat {
    const newChat: Chat = {
      id: uuidv4(),
      usersIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.chats.set(newChat.id, newChat);
    return newChat;
  }

  getChat(chatId: string): Chat {
    const chat = this.chats.get(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    return chat;
  }

  getAllChats(): Chat[] {
    return Array.from(this.chats.values());
  }

  findChatByUserId(userId: string): Chat {
    for (const chat of this.chats.values()) {
      if (chat.usersIds.includes(userId)) {
        return chat;
      }
    }
    throw new NotFoundException(`No chat found for user ID ${userId}`);
  }

  deleteChat(chatId: string): boolean {
    const deleted = this.chats.delete(chatId);
    if (!deleted) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    return true;
  }
}
