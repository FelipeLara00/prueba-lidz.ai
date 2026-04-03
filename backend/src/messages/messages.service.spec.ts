import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;
  let prisma: {
    message: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      message: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new MessagesService(prisma as never);
  });

  it('creates message converting sentAt to Date', async () => {
    const dto = {
      text: 'hola',
      role: 'client' as const,
      sentAt: '2026-04-10T00:00:00.000Z',
      clientId: '11111111-1111-1111-1111-111111111111',
    };
    const created = {
      id: 'm1',
      text: 'hola',
      role: 'client' as const,
      sentAt: new Date(dto.sentAt),
      clientId: dto.clientId,
      createdAt: new Date(),
    };
    prisma.message.create.mockResolvedValue(created);

    await expect(service.create(dto)).resolves.toEqual(created);
    expect(prisma.message.create).toHaveBeenCalledWith({
      data: { ...dto, sentAt: new Date(dto.sentAt) },
    });
  });

  it('throws NotFoundException when message does not exist', async () => {
    prisma.message.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates message converting sentAt when present', async () => {
    prisma.message.findUnique.mockResolvedValue({ id: 'm1' });
    prisma.message.update.mockResolvedValue({ id: 'm1' });

    await service.update('m1', { sentAt: '2026-06-01T00:00:00.000Z' });

    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: 'm1' },
      data: { sentAt: new Date('2026-06-01T00:00:00.000Z') },
    });
  });

  it('wraps unexpected errors as InternalServerErrorException', async () => {
    prisma.message.findMany.mockRejectedValue(new Error('db down'));

    await expect(service.findAll()).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
