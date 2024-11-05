import { Injectable } from '@nestjs/common';
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

  getChat(chatId: string): Chat | undefined {
    return this.chats.get(chatId);
  }

  getAllChats(): Chat[] {
    return Array.from(this.chats.values());
  }

  findChatByUserId(userId: string): Chat | undefined {
    for (const chat of this.chats.values()) {
      if (chat.usersIds.includes(userId)) {
        return chat;
      }
    }
    return undefined;
  }

  deleteChat(chatId: string): boolean {
    return this.chats.delete(chatId);
  }
}
