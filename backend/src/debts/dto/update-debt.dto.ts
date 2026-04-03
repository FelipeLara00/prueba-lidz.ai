import {
  IsDateString,
  IsInt,
  IsOptional,
  Min,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateDebtDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  institution?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;
}
