import { UserService } from '@app/user/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      const authenticated = await compare(password, user.password);

      if (!authenticated) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException('Credential are not valid');
    }
  }
}
