import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMessageDto {
  @ApiPropertyOptional({ example: 'Mensaje actualizado' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;

  @ApiPropertyOptional({ enum: ['client', 'agent'], example: 'client' })
  @IsOptional()
  @IsIn(['client', 'agent'])
  role?: 'client' | 'agent';

  @ApiPropertyOptional({
    example: '2026-04-03T14:05:00.000Z',
    description: 'Fecha ISO de envio',
  })
  @IsOptional()
  @IsDateString()
  sentAt?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;
}
