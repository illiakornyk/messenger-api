import 'dotenv/config';
import { User } from '@app/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Chat } from '@app/chat/entities/chat.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD),
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  entities: [User, Chat],
  subscribers: [],
  migrations: ['./src/typeorm/migrations/*.ts'],
});
