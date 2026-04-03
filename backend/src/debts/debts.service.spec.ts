import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DebtsService } from './debts.service';

describe('DebtsService', () => {
  let service: DebtsService;
  let prisma: {
    debt: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      debt: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new DebtsService(prisma as never);
  });

  it('creates debt converting dueDate to Date', async () => {
    const dto = {
      institution: 'Bank',
      amount: 400,
      dueDate: '2026-04-15T00:00:00.000Z',
      clientId: '11111111-1111-1111-1111-111111111111',
    };
    const created = {
      id: 'd1',
      institution: 'Bank',
      amount: 400,
      dueDate: new Date(dto.dueDate),
      clientId: dto.clientId,
      createdAt: new Date(),
    };
    prisma.debt.create.mockResolvedValue(created);

    await expect(service.create(dto)).resolves.toEqual(created);
    expect(prisma.debt.create).toHaveBeenCalledWith({
      data: { ...dto, dueDate: new Date(dto.dueDate) },
    });
  });

  it('throws NotFoundException when debt does not exist', async () => {
    prisma.debt.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates debt converting dueDate when present', async () => {
    prisma.debt.findUnique.mockResolvedValue({ id: 'd1' });
    prisma.debt.update.mockResolvedValue({ id: 'd1' });

    await service.update('d1', { dueDate: '2026-05-01T00:00:00.000Z' });

    expect(prisma.debt.update).toHaveBeenCalledWith({
      where: { id: 'd1' },
      data: { dueDate: new Date('2026-05-01T00:00:00.000Z') },
    });
  });

  it('wraps unexpected errors as InternalServerErrorException', async () => {
    prisma.debt.findMany.mockRejectedValue(new Error('db down'));

    await expect(service.findAll()).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
