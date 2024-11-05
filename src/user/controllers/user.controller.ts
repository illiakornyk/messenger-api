import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { User } from '../classes/user.class';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been created.',
    type: User,
  })
  @ApiBody({ type: User })
  async create(@Body() user: User): Promise<User> {
    return this.userService.createOne(user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'The found user', type: User })
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'User has been deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
