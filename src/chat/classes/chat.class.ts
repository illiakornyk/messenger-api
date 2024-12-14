import { ApiProperty } from '@nestjs/swagger';

export class Chat {
  @ApiProperty({ type: String, format: 'uuid', required: true })
  id: string;

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;
}
