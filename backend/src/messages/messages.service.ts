import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { Message } from './entities';

@Injectable()
export class MessagesService {
  private readonly messages: Message[] = [];

  create(createMessageDto: CreateMessageDto): Message {
    try {
      const message: Message = {
        id: randomUUID(),
        text: createMessageDto.text,
        role: createMessageDto.role,
        sentAt: createMessageDto.sentAt,
        clientId: createMessageDto.clientId,
        createdAt: new Date(),
      };
      this.messages.push(message);
      return message;
    } catch (error) {
      this.handleError(error);
    }
  }

  findAll(): Message[] {
    try {
      return this.messages;
    } catch (error) {
      this.handleError(error);
    }
  }

  findOne(id: string): Message {
    try {
      const message = this.messages.find((item) => item.id === id);
      if (!message) {
        throw new NotFoundException(`Message with id ${id} was not found`);
      }
      return message;
    } catch (error) {
      this.handleError(error);
    }
  }

  update(id: string, updateMessageDto: UpdateMessageDto): Message {
    try {
      const message = this.findOne(id);
      Object.assign(message, updateMessageDto);
      return message;
    } catch (error) {
      this.handleError(error);
    }
  }

  remove(id: string): void {
    try {
      const messageIndex = this.messages.findIndex((item) => item.id === id);
      if (messageIndex === -1) {
        throw new NotFoundException(`Message with id ${id} was not found`);
      }
      this.messages.splice(messageIndex, 1);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Unexpected error in messages service');
  }
}
