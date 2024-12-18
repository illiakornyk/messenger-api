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
          throw new BadRequestException(`Email is already in use.`);
        }
        if (existingUser.email === updateUserDto.username) {
          throw new BadRequestException(`Username is already in use.`);
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
