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
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { MessagesService } from '@app/messages/services/messages.service';
import { CreateMessageDto } from '@app/messages/dtos/create-message.dto';
import { IGetMessageResponse } from '@app/messages/interfaces/get-message-response.interface';
import { GetMessageResponse } from '@app/messages/classes/get-message-response.class';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The message has been created.',
    type: GetMessageResponse,
  })
  @ApiBody({ type: CreateMessageDto })
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<IGetMessageResponse> {
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
    status: HttpStatus.OK,
    description: 'List of messages or filtered messages',
    type: () => GetMessageResponse,
    isArray: true,
  })
  async getMessages(
    @Query('senderId') senderId?: string,
    @Query('chatId') chatId?: string,
  ): Promise<IGetMessageResponse[]> {
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found message',
    type: () => GetMessageResponse,
  })
  async getMessageById(@Param('id') id: string): Promise<IGetMessageResponse> {
    return await this.messagesService.getMessageById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the message' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Message has been deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(@Param('id') id: string): Promise<void> {
    await this.messagesService.deleteMessage(id);
  }
}
