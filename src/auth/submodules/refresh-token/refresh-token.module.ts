import { RefreshToken } from '@app/auth/submodules/refresh-token/refresh-token.entity';
import { RefreshTokenService } from '@app/auth/submodules/refresh-token/refresh-token.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
