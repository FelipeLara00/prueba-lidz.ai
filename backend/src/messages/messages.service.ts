import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { Message } from './entities';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      return await this.prisma.message.create({
        data: {
          ...createMessageDto,
          sentAt: new Date(createMessageDto.sentAt),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(): Promise<Message[]> {
    try {
      return await this.prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string): Promise<Message> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
      });
      if (!message) {
        throw new NotFoundException(`Message with id ${id} was not found`);
      }
      return message;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    try {
      await this.findOne(id);
      return await this.prisma.message.update({
        where: { id },
        data: {
          ...updateMessageDto,
          ...(updateMessageDto.sentAt
            ? { sentAt: new Date(updateMessageDto.sentAt) }
            : {}),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.prisma.message.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException(
      'Unexpected error in messages service',
    );
  }
}
