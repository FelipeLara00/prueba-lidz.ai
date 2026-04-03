import {
  IsDateString,
  IsInt,
  Min,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtDto {
  @ApiProperty({ example: 'Banco Estado' })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiProperty({ example: 320000, minimum: 0 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: '2026-05-22T00:00:00.000Z',
    description: 'Fecha ISO de vencimiento',
  })
  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    format: 'uuid',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsNotEmpty()
  @IsUUID()
  clientId: string;
}
