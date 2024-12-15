import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from '@app/user/dtos/create-user.dto';
import { UserService } from '@app/user/services/user.service';
import { TUserResponse } from '../types/user-respose.type';
import { UserResponse } from '../classes/user-response.class';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been created.',
    type: () => UserResponse,
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() user: CreateUserDto): Promise<TUserResponse> {
    return this.userService.createOne(user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users',
    type: () => UserResponse,
  })
  async findAll(): Promise<TUserResponse[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found user',
    type: () => UserResponse,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TUserResponse | null> {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been deleted',
  })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
