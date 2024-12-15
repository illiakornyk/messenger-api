import { User } from '@app/user/entities/user.entity';
export type TUserResponse = Omit<User, 'password'>;
