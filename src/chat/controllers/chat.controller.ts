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
import { Chat } from '../entities/chat.entity'; // Use Chat entity here
import { CreateChatDto } from '../dtos/create-chat.dto'; // DTO for input validation

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
  @ApiBody({ type: CreateChatDto })
  async createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return await this.chatService.createChat(createChatDto.userIds);
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
  async getChats(@Query('userId') userId?: string): Promise<Chat | Chat[]> {
    if (userId) {
      return await this.chatService.findChatByUserId(userId);
    }
    return await this.chatService.getAllChats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a chat by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the chat' })
  @ApiResponse({ status: 200, description: 'The found chat', type: Chat })
  async getChatById(@Param('id') id: string): Promise<Chat> {
    return await this.chatService.getChat(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the chat' })
  @ApiResponse({ status: 204, description: 'Chat has been deleted' })
  @HttpCode(204)
  async deleteChat(@Param('id') id: string): Promise<void> {
    await this.chatService.deleteChat(id);
  }
}
