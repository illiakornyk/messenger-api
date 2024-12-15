import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { TUserResponse } from '../types/user-respose.type';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOne(user: CreateUserDto): Promise<TUserResponse> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: user.email }, { username: user.username }],
    });

    if (existingUser) {
      if (existingUser.email === user.email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.username === user.username) {
        throw new ConflictException('Username already exists');
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

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
          { username: updateUserDto.username },
        ],
      });

      if (existingUser && existingUser.id !== userId) {
        if (existingUser.email === updateUserDto.email) {
          throw new BadRequestException(`Email is already in use.`);
        }
        if (existingUser.username === updateUserDto.username) {
          throw new BadRequestException(`Username is already in use.`);
        }
      }
    }

    user.name = updateUserDto.name || user.name;
    user.username = updateUserDto.username || user.username;
    user.email = updateUserDto.email || user.email;

    const savedUser = await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  async findAll(): Promise<TUserResponse[]> {
    return this.userRepository.find({
      select: ['id', 'name', 'username', 'email', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<TUserResponse> {
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

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
