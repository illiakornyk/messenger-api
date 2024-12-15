import { User } from '@app/user/classes/user.class';

export interface CreateChatResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  users: Pick<User, 'id' | 'name' | 'username'>[];
}
