import { ApiProperty } from '@nestjs/swagger';

export class Debt {
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
