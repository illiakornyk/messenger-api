import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  private users = new Map<string, User>();

  createOne(user: Partial<User>): User {
    const newUser: User = {
      id: uuidv4(),
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(newUser.id, newUser);
    return newUser;
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  findOne(id: string): User {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  remove(id: string): void {
    const deleted = this.users.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
