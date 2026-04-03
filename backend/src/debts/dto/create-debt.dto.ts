import {
  IsDateString,
  IsInt,
  Min,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDebtDto {
  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  @IsUUID()
  clientId: string;
}
