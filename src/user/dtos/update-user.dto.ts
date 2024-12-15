import { IsOptional, IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false, description: 'Name of the user' })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, description: 'Unique username' })
  @IsString()
  @Length(1, 50)
  @IsOptional()
  username?: string;

  @ApiProperty({
    required: false,
    description: 'Unique email address',
    type: 'email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
