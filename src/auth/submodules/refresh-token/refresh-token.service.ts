import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@app/user/entities/user.entity';
import { RefreshToken } from '@app/auth/submodules/refresh-token/refresh-token.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createOrUpdateRefreshToken(
    user: User,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const saltRounds = 10;
    const hashedToken = await bcrypt.hash(token, saltRounds);

    let refreshToken = await this.refreshTokenRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (refreshToken) {
      refreshToken.token = hashedToken;
      refreshToken.expiresAt = expiresAt;
    } else {
      refreshToken = this.refreshTokenRepository.create({
        user,
        token: hashedToken,
        expiresAt,
      });
    }

    return this.refreshTokenRepository.save(refreshToken);
  }

  async getRefreshToken(userId: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const refreshToken = await this.getRefreshToken(userId);

    if (!refreshToken) {
      return false;
    }

    const isValid = await bcrypt.compare(token, refreshToken.token);

    if (!isValid || refreshToken.expiresAt < new Date()) {
      return false;
    }

    return true;
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }
}
