import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClientDto {
  @ApiPropertyOptional({ example: 'Juan Perez' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '12.345.678-9' })
  @IsOptional()
  @IsString()
  rut?: string;

  @ApiPropertyOptional({ example: 1500000, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  salary?: number;

  @ApiPropertyOptional({ example: 4500000, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  savings?: number;
}
