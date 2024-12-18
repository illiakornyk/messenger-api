import { User } from '@app/user/entities/user.entity';

export function formatUser(user: User): {
  id: string;
  name: string;
  username: string;
} {
  return {
    id: user.id,
    name: user.name,
    username: user.email,
  };
}
