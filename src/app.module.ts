import { Module } from '@nestjs/common';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    HealthcheckModule,
    UserModule,
    ChatModule,
    MessagesModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
