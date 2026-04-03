import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

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
}
