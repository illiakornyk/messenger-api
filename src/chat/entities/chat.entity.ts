import { User } from '@app/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, (user) => user.chats, { cascade: true }) // Bidirectional many-to-many
  @JoinTable({
    name: 'chat_users', // Name of the join table
    joinColumn: {
      name: 'chat_id', // Join column in the join table
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id', // Inverse join column in the join table
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}