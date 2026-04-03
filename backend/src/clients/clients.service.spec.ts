import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: {
    client: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      client: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new ClientsService(prisma as never);
  });

  it('creates a client in prisma', async () => {
    const dto = { name: 'Ana', rut: '11-1', salary: 1000, savings: 200 };
    const created = {
      id: 'c1',
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.client.create.mockResolvedValue(created);

    await expect(service.create(dto)).resolves.toEqual(created);
    expect(prisma.client.create).toHaveBeenCalledWith({ data: dto });
  });

  it('throws NotFoundException when client does not exist', async () => {
    prisma.client.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('wraps unexpected errors as InternalServerErrorException', async () => {
    prisma.client.findMany.mockRejectedValue(new Error('db down'));

    await expect(service.findAll()).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('deletes an existing client', async () => {
    prisma.client.findUnique.mockResolvedValue({ id: 'c1' });
    prisma.client.delete.mockResolvedValue({ id: 'c1' });

    await expect(service.remove('c1')).resolves.toBeUndefined();
    expect(prisma.client.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
  });
});
