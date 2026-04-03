import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateClientDto, UpdateClientDto } from './dto';
import { Client } from './entities';

@Injectable()
export class ClientsService {
  private readonly clients: Client[] = [];

  create(createClientDto: CreateClientDto): Client {
    try {
      const now = new Date();
      const client: Client = {
        id: randomUUID(),
        name: createClientDto.name,
        rut: createClientDto.rut,
        salary: createClientDto.salary,
        savings: createClientDto.savings,
        createdAt: now,
        updatedAt: now,
      };
      this.clients.push(client);
      return client;
    } catch (error) {
      this.handleError(error);
    }
  }

  findAll(): Client[] {
    try {
      return this.clients;
    } catch (error) {
      this.handleError(error);
    }
  }

  findOne(id: string): Client {
    try {
      const client = this.clients.find((item) => item.id === id);
      if (!client) {
        throw new NotFoundException(`Client with id ${id} was not found`);
      }
      return client;
    } catch (error) {
      this.handleError(error);
    }
  }

  update(id: string, updateClientDto: UpdateClientDto): Client {
    try {
      const client = this.findOne(id);
      Object.assign(client, updateClientDto);
      client.updatedAt = new Date();
      return client;
    } catch (error) {
      this.handleError(error);
    }
  }

  remove(id: string): void {
    try {
      const clientIndex = this.clients.findIndex((item) => item.id === id);
      if (clientIndex === -1) {
        throw new NotFoundException(`Client with id ${id} was not found`);
      }
      this.clients.splice(clientIndex, 1);
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
