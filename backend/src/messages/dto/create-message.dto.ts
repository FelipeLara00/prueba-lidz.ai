import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'Necesito ayuda para evaluar arriendo.' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ enum: ['client', 'agent'], example: 'client' })
  @IsNotEmpty()
  @IsIn(['client', 'agent'])
  role: 'client' | 'agent';

  @ApiProperty({
    example: '2026-04-03T14:00:00.000Z',
    description: 'Fecha ISO de envio',
  })
  @IsNotEmpty()
  @IsDateString()
  sentAt: string;

  @ApiProperty({
    format: 'uuid',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsNotEmpty()
  @IsUUID()
  clientId: string;
}
