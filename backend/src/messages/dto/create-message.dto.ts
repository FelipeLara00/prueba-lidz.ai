import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @IsIn(['client', 'agent'])
  role: 'client' | 'agent';

  @IsNotEmpty()
  @IsDateString()
  sentAt: string;

  @IsNotEmpty()
  @IsUUID()
  clientId: string;
}
