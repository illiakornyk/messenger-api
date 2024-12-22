import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    minLength: 6,
    maxLength: 128,
  })
  @IsString()
  @Length(6, 255)
  @IsNotEmpty()
  password: string;
}
