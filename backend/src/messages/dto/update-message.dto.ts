import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;

  @IsOptional()
  @IsIn(['client', 'agent'])
  role?: 'client' | 'agent';

  @IsOptional()
  @IsDateString()
  sentAt?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;
}
