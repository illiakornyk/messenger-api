import 'dotenv/config';
import { User } from '@app/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Chat } from '@app/chat/entities/chat.entity';
import { Message } from '@app/messages/entities/message.entity';
import { RefreshToken } from '@app/auth/submodules/refresh-token/refresh-token.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD),
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  entities: [User, Chat, Message, RefreshToken],
  subscribers: [],
  migrations: ['./src/typeorm/migrations/*.ts'],
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
});
