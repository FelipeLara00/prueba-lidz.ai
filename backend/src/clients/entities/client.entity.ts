import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ClientDebt {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  institution: string;

  @ApiProperty({ minimum: 0 })
  amount: number;

  @ApiProperty({ type: String, format: 'date-time' })
  dueDate: Date;

  @ApiProperty({ format: 'uuid' })
  clientId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

class ClientMessage {
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

export class Client {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  rut: string;

  @ApiProperty({ minimum: 0 })
  salary: number;

  @ApiProperty({ minimum: 0 })
  savings: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;

  @ApiPropertyOptional({ type: [ClientDebt] })
  debts?: ClientDebt[];

  @ApiPropertyOptional({ type: [ClientMessage] })
  messages?: ClientMessage[];
}
