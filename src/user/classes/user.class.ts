import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: String, required: true, uniqueItems: true })
  id: string;

  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: String, required: true, uniqueItems: true })
  username: string;

  @ApiProperty({ type: String, required: true, uniqueItems: true })
  email: string;

  @ApiProperty({ type: String, required: true })
  password: string;

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;
}
