import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { DebtsModule } from './debts/debts.module';
import { MessagesModule } from './messages/messages.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ClientsModule, DebtsModule, MessagesModule],
})
export class AppModule {}
