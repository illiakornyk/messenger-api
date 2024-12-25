import { LocalStrategy } from '@app/auth/strategies/local.strategy';
import { UserModule } from '@app/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '@app/auth/strategies/jwt-refresh.strategy';
import { RefreshTokenModule } from '@app/auth/submodules/refresh-token/refresh-token.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
