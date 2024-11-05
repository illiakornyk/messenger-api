import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
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
import { ChatService } from '../services/chat.service';
import { Chat } from '../classes/chat.class';

@ApiTags('chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({
    status: 201,
    description: 'The chat has been created.',
    type: Chat,
  })
  @ApiBody({ type: Chat })
  createChat(@Body() chat: Chat): Chat {
    return this.chatService.createChat(chat.usersIds);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all chats or find by user ID' })
  @ApiQuery({
    name: 'userId',
    type: 'string',
    required: false,
    description: 'UUID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat(s) retrieved successfully',
    type: [Chat],
  })
  getChats(@Query('userId') userId?: string): Chat | Chat[] {
    if (userId) {
      return this.chatService.findChatByUserId(userId);
    }
    return this.chatService.getAllChats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a chat by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the chat' })
  @ApiResponse({ status: 200, description: 'The found chat', type: Chat })
  getChatById(@Param('id') id: string): Chat | undefined {
    return this.chatService.getChat(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the chat' })
  @ApiResponse({ status: 204, description: 'Chat has been deleted' })
  @HttpCode(204)
  deleteChat(@Param('id') id: string): boolean {
    return this.chatService.deleteChat(id);
  }
}