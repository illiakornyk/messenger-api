import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message } from '../entities/message.entity';
import { CreateMessageResponse } from '@app/messages/interfaces/create-message-response.interface';
import { CreateMessageResponse as CreateMessageResponseClass } from '@app/messages/classes/create-message-response.class';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({
    status: 201,
    description: 'The message has been created.',
    type: CreateMessageResponseClass,
  })
  @ApiBody({ type: CreateMessageDto })
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<CreateMessageResponse> {
    return await this.messagesService.createMessage(
      createMessageDto.senderId,
      createMessageDto.chatId,
      createMessageDto.content,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all messages or filter by sender or chat',
  })
  @ApiQuery({
    name: 'senderId',
    type: 'string',
    required: false,
    description: 'UUID of the sender',
  })
  @ApiQuery({
    name: 'chatId',
    type: 'string',
    required: false,
    description: 'UUID of the chat',
  })
  @ApiResponse({
    status: 200,
    description: 'List of messages or filtered messages',
    type: [Message],
  })
  async getMessages(
    @Query('senderId') senderId?: string,
    @Query('chatId') chatId?: string,
  ): Promise<Message[]> {
    if (senderId && chatId) {
      throw new BadRequestException(
        'You cannot filter by both senderId and chatId simultaneously.',
      );
    }

    if (senderId) {
      return await this.messagesService.getMessagesBySenderId(senderId);
    } else if (chatId) {
      return await this.messagesService.getMessagesByChatId(chatId);
    }

    return await this.messagesService.getAllMessages();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a message by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the message' })
  @ApiResponse({ status: 200, description: 'The found message', type: Message })
  async getMessageById(@Param('id') id: string): Promise<Message> {
    return await this.messagesService.getMessageById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the message' })
  @ApiResponse({ status: 204, description: 'Message has been deleted' })
  @HttpCode(204)
  async deleteMessage(@Param('id') id: string): Promise<void> {
    await this.messagesService.deleteMessage(id);
  }
}
