import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { TUserResponse } from '../types/user-respose.type';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ICreateUser } from '@app/user/interfaces/create-user.interface';
import { hash } from 'bcrypt';
import { USER_CONSTANTS } from '../constants/user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOne(user: ICreateUser): Promise<TUserResponse> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: user.email }, { username: user.username }],
    });

    if (existingUser) {
      if (existingUser.email === user.email) {
        throw new ConflictException(USER_CONSTANTS.ERRORS.EMAIL_ALREADY_EXISTS);
      }
      if (existingUser.username === user.username) {
        throw new ConflictException(
          USER_CONSTANTS.ERRORS.USERNAME_ALREADY_EXISTS,
        );
      }
    }

    const saltRounds = 10;
    const hashedPassword = await hash(user.password, saltRounds);

    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await this.userRepository.save(newUser);

    const { password, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<TUserResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (updateUserDto.email || updateUserDto.username) {
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: updateUserDto.email },
          { email: updateUserDto.username },
        ],
      });

      if (existingUser && existingUser.id !== userId) {
        if (existingUser.email === updateUserDto.email) {
          throw new BadRequestException(
            USER_CONSTANTS.ERRORS.EMAIL_ALREADY_EXISTS,
          );
        }
        if (existingUser.email === updateUserDto.username) {
          throw new BadRequestException(
            USER_CONSTANTS.ERRORS.USERNAME_ALREADY_EXISTS,
          );
        }
      }
    }

    user.name = updateUserDto.name || user.name;
    user.email = updateUserDto.username || user.email;
    user.email = updateUserDto.email || user.email;

    const savedUser = await this.userRepository.save(user);

    const { password: _, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  async get(): Promise<TUserResponse[]> {
    return this.userRepository.find({
      select: ['id', 'name', 'username', 'email', 'createdAt', 'updatedAt'],
    });
  }

  async getOne(id: string): Promise<TUserResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'username', 'email', 'createdAt', 'updatedAt'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
