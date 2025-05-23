import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { Chat } from '@app/chat/entities/chat.entity';
import { Message } from '@app/messages/entities/message.entity';
import { RefreshToken } from '@app/auth/submodules/refresh-token/refresh-token.entity';
import { getDatabaseSslConfig } from '@app/common/utils/database-utils';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST') || 'localhost',
        port: configService.get<number>('POSTGRES_PORT') || 5432,
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [User, Chat, Message, RefreshToken],
        synchronize: false,
        ssl: getDatabaseSslConfig(),
      }),
    }),
  ],
})
export class DatabaseModule {}
