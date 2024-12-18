import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { RegisterUserRequestDto } from './dtos/register-user-req.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@app/user/services/user.service';
import { ICreateUser } from '@app/user/interfaces/create-user.interface';
import { TUserResponse } from '@app/user/types/user-respose.type';
import { AccessToken } from '@app/auth/interfaces/access-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async login(user: TUserResponse): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterUserRequestDto): Promise<AccessToken> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: ICreateUser = { ...user, password: hashedPassword };
    const savedUser = await this.userService.createOne(newUser);
    return this.login(savedUser);
  }
}
