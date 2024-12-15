import { User } from '@app/user/classes/user.class';

export interface CreateMessageResponse {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  sender: Pick<User, 'id' | 'name' | 'username'>;
  chatId: string;
}
