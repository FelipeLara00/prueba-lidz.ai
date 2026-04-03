import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateClientDebtDto {
  @ApiProperty({ example: 'Banco Estado' })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiProperty({ example: 1200000, minimum: 0 })
  @IsInt()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: '2026-06-10T00:00:00.000Z',
    description: 'Fecha ISO de vencimiento',
  })
  @IsDateString()
  dueDate: string;
}

class CreateClientMessageDto {
  @ApiProperty({ example: 'Necesito evaluar un credito hipotecario en UF.' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ enum: ['client', 'agent'], example: 'client' })
  @IsIn(['client', 'agent'])
  role: 'client' | 'agent';

  @ApiProperty({
    example: '2026-04-03T14:00:00.000Z',
    description: 'Fecha ISO de envio',
  })
  @IsDateString()
  sentAt: string;
}

export class CreateClientDto {
  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '12.345.678-9' })
  @IsString()
  @IsNotEmpty()
  rut: string;

  @ApiProperty({ example: 1500000, minimum: 0 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  salary: number;

  @ApiProperty({ example: 4500000, minimum: 0 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  savings: number;

  @ApiPropertyOptional({ type: [CreateClientDebtDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClientDebtDto)
  debts?: CreateClientDebtDto[];

  @ApiPropertyOptional({ type: [CreateClientMessageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClientMessageDto)
  messages?: CreateClientMessageDto[];
}
