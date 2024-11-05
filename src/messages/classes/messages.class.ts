import { ApiProperty } from '@nestjs/swagger';

export class Message {
  @ApiProperty({ type: String, format: 'uuid', required: true })
  id: string;

  @ApiProperty({ type: String, format: 'uuid', required: true })
  senderId: string;

  @ApiProperty({ type: [String], format: 'uuid', required: true })
  receiverIds: string[];

  @ApiProperty({ type: String, required: true })
  content: string;

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;
}
