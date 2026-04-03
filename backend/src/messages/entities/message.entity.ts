import { ApiProperty } from '@nestjs/swagger';

export class Message {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  text: string;

  @ApiProperty({ enum: ['client', 'agent'] })
  role: 'client' | 'agent';

  @ApiProperty({ type: String, format: 'date-time' })
  sentAt: Date;

  @ApiProperty({ format: 'uuid' })
  clientId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}
