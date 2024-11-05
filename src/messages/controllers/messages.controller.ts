import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Message } from '../classes/messages.class';
import { MessagesService } from '../services/messages.service';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({
    status: 201,
    description: 'The message has been created.',
    type: Message,
  })
  @ApiBody({ type: Message })
  createMessage(
    @Body('senderId') senderId: string,
    @Body('receiverIds') receiverIds: string[],
    @Body('content') content: string,
  ): Message {
    return this.messagesService.createMessage(senderId, receiverIds, content);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all messages or filter by sender or receiver',
  })
  @ApiQuery({
    name: 'senderId',
    type: 'string',
    required: false,
    description: 'UUID of the sender',
  })
  @ApiQuery({
    name: 'receiverId',
    type: 'string',
    required: false,
    description: 'UUID of a receiver',
  })
  @ApiResponse({
    status: 200,
    description: 'List of messages or filtered messages',
    type: [Message],
  })
  getMessages(
    @Query('senderId') senderId?: string,
    @Query('receiverId') receiverId?: string,
  ): Message[] {
    if (senderId) {
      return this.messagesService.getMessagesBySenderId(senderId);
    } else if (receiverId) {
      return this.messagesService.getMessagesByReceiverId(receiverId);
    }

    if (senderId && receiverId) {
      throw new BadRequestException(
        'You can not pass both senderId and receiverId simultaneously.',
      );
    }

    return this.messagesService.getAllMessages();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a message by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the message' })
  @ApiResponse({ status: 200, description: 'The found message', type: Message })
  getMessageById(@Param('id') id: string): Message {
    return this.messagesService.getMessageById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the message' })
  @ApiResponse({ status: 200, description: 'Message has been deleted' })
  deleteMessage(@Param('id') id: string): boolean {
    return this.messagesService.deleteMessage(id);
  }
}
