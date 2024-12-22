import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@app/auth/guards/local-auth.guard';
import { CurrentUser } from '@app/auth/current-user.decorator';
import { User } from '@app/user/entities/user.entity';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from '@app/auth/dtos/register-user.dto';
import { LoginUserDto } from '@app/auth/dtos/login-user.dto';
import { JwtRefreshAuthGuard } from '@app/auth/guards/jwt-refresh-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User register' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully registered',
  })
  @ApiBody({ type: RegisterUserDto })
  async create(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged in.',
  })
  @ApiBody({ type: LoginUserDto })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.verifyUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    await this.authService.login(user, response);
    return { message: 'Login successful' };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }
}
