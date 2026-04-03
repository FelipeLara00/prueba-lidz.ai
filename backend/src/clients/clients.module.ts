import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ClientsFollowUpController } from './clients-follow-up.controller';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [MessagesModule],
  controllers: [ClientsController, ClientsFollowUpController],
  providers: [ClientsService],
})
export class ClientsModule {}
