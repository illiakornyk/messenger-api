import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayNotEmpty, MaxLength } from 'class-validator';

export class CreateChatDto {
	@ApiProperty(
		{
			type: [String],
			format:'uuid',
			description: 'An array of user IDs to add to the chat',
		}
	)
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  userIds: string[];
}
