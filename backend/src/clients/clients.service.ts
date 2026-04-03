import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto, UpdateClientDto } from './dto';
import { Client } from './entities';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      return await this.prisma.client.create({
        data: createClientDto,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(): Promise<Client[]> {
    try {
      return await this.prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string): Promise<Client> {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id },
      });
      if (!client) {
        throw new NotFoundException(`Client with id ${id} was not found`);
      }
      return client;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    try {
      await this.findOne(id);
      return await this.prisma.client.update({
        where: { id },
        data: updateClientDto,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.prisma.client.delete({
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
    throw new InternalServerErrorException('Unexpected error in clients service');
  }
}
