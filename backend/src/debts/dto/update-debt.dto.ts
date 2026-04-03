import {
  IsDateString,
  IsInt,
  IsOptional,
  Min,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDebtDto {
  @ApiPropertyOptional({ example: 'Banco Estado' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  institution?: string;

  @ApiPropertyOptional({ example: 320000, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({
    example: '2026-05-22T00:00:00.000Z',
    description: 'Fecha ISO de vencimiento',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;
}
