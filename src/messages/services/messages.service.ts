import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../classes/messages.class';

@Injectable()
export class MessagesService {
  private messages = new Map<string, Message>();

  createMessage(
    senderId: string,
    receiverIds: string[],
    content: string,
  ): Message {
    const newMessage: Message = {
      id: uuidv4(),
      senderId,
      receiverIds,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }

  getMessageById(messageId: string): Message {
    const message = this.messages.get(messageId);
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
    return message;
  }

  getMessagesBySenderId(senderId: string): Message[] {
    const messages = Array.from(this.messages.values()).filter(
      (message) => message.senderId === senderId,
    );

    if (messages.length === 0) {
      throw new NotFoundException(
        `No messages found for sender ID ${senderId}`,
      );
    }

    return messages;
  }

  getMessagesByReceiverId(receiverId: string): Message[] {
    const messages = Array.from(this.messages.values()).filter((message) =>
      message.receiverIds.includes(receiverId),
    );

    if (messages.length === 0) {
      throw new NotFoundException(
        `No messages found for receiver ID ${receiverId}`,
      );
    }

    return messages;
  }

  getAllMessages(): Message[] {
    return Array.from(this.messages.values());
  }

  deleteMessage(messageId: string): boolean {
    const deleted = this.messages.delete(messageId);
    if (!deleted) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
    return true;
  }
}
