import { User } from '@app/user/classes/user.class';
import { ApiProperty } from '@nestjs/swagger';

class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;
}

export class CreateMessageResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    type: () => UserResponse,
    readOnly: true,
  })
  sender: Pick<User, 'id' | 'name' | 'username'>;

  @ApiProperty()
  chatId: string;
}
