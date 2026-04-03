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

class CreateClientDebtDto {
  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsInt()
  @Min(0)
  amount: number;

  @IsDateString()
  dueDate: string;
}

class CreateClientMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsIn(['client', 'agent'])
  role: 'client' | 'agent';

  @IsDateString()
  sentAt: string;
}

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  salary: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  savings: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClientDebtDto)
  debts?: CreateClientDebtDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClientMessageDto)
  messages?: CreateClientMessageDto[];
}
