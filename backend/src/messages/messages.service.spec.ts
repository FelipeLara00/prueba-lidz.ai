import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { MessagesService } from './messages.service';

jest.mock('openai');

describe('MessagesService', () => {
  let service: MessagesService;
  let configService: {
    get: jest.Mock;
  };
  let prisma: {
    message: {
      create: jest.Mock;
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    client: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      message: {
        create: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      client: {
        findUnique: jest.fn(),
      },
    };
    configService = {
      get: jest.fn(),
    };
    service = new MessagesService(prisma as never, configService as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates message converting sentAt to Date', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'OPENAI_API_KEY') return 'test-key';
      if (key === 'OPENAI_MODEL') return 'gpt-4.1-mini';
      return undefined;
    });
    const dto = {
      text: 'Quiero evaluar un credito hipotecario en UF',
      role: 'client' as const,
      sentAt: '2026-04-10T00:00:00.000Z',
      clientId: '11111111-1111-1111-1111-111111111111',
    };
    const createdClient = {
      id: 'm1',
      text: 'hola',
      role: 'client' as const,
      sentAt: new Date(dto.sentAt),
      clientId: dto.clientId,
      createdAt: new Date(),
    };
    const createdAgent = {
      id: 'm2',
      text: 'respuesta ia',
      role: 'agent' as const,
      sentAt: new Date(),
      clientId: dto.clientId,
      createdAt: new Date(),
    };
    prisma.message.create
      .mockResolvedValueOnce(createdClient)
      .mockResolvedValueOnce(createdAgent);
    prisma.message.findMany.mockResolvedValue([]);
    prisma.client.findUnique.mockResolvedValue({
      id: dto.clientId,
      salary: 1000000,
      debts: [{ amount: 500000 }],
    });
    const createMock = jest
      .fn()
      .mockResolvedValue({ output_text: 'respuesta ia' });
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      responses: { create: createMock },
    }));

    await expect(service.create(dto)).resolves.toEqual(createdClient);
    expect(prisma.message.create).toHaveBeenCalledWith({
      data: { ...dto, sentAt: new Date(dto.sentAt) },
    });
    expect(prisma.message.create).toHaveBeenCalledWith({
      data: {
        text: 'respuesta ia',
        role: 'agent',
        sentAt: expect.any(Date),
        clientId: dto.clientId,
      },
    });
  });

  it('rejects manual agent message creation', async () => {
    const dto = {
      text: 'hola',
      role: 'agent' as const,
      sentAt: '2026-04-10T00:00:00.000Z',
      clientId: '11111111-1111-1111-1111-111111111111',
    };

    await expect(service.create(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('creates client message even when AI is unavailable', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'OPENAI_API_KEY') return undefined;
      if (key === 'OPENAI_MODEL') return 'gpt-4.1-mini';
      return undefined;
    });
    const dto = {
      text: 'Necesito ver dividendo en UF',
      role: 'client' as const,
      sentAt: '2026-04-10T00:00:00.000Z',
      clientId: '11111111-1111-1111-1111-111111111111',
    };
    const createdClient = {
      id: 'm1',
      text: 'hola',
      role: 'client' as const,
      sentAt: new Date(dto.sentAt),
      clientId: dto.clientId,
      createdAt: new Date(),
    };
    prisma.message.create.mockResolvedValueOnce(createdClient);
    prisma.message.findMany.mockResolvedValue([]);
    prisma.client.findUnique.mockResolvedValue({
      id: dto.clientId,
      salary: 1000000,
      debts: [{ amount: 100000 }],
    });

    await expect(service.create(dto)).resolves.toEqual(createdClient);
    expect(prisma.message.create).toHaveBeenCalledTimes(1);
  });

  it('does not generate agent response when rules do not match', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'OPENAI_API_KEY') return 'test-key';
      if (key === 'OPENAI_MODEL') return 'gpt-4.1-mini';
      return undefined;
    });
    const dto = {
      text: 'Hola, como estas?',
      role: 'client' as const,
      sentAt: '2026-04-10T00:00:00.000Z',
      clientId: '11111111-1111-1111-1111-111111111111',
    };
    const createdClient = {
      id: 'm1',
      text: dto.text,
      role: dto.role,
      sentAt: new Date(dto.sentAt),
      clientId: dto.clientId,
      createdAt: new Date(),
    };
    prisma.message.create.mockResolvedValueOnce(createdClient);
    const createMock = jest
      .fn()
      .mockResolvedValue({ output_text: 'respuesta ia' });
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      responses: { create: createMock },
    }));

    await expect(service.create(dto)).resolves.toEqual(createdClient);
    expect(prisma.message.create).toHaveBeenCalledTimes(1);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('does not generate agent response when debt is >= 3x salary', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'OPENAI_API_KEY') return 'test-key';
      if (key === 'OPENAI_MODEL') return 'gpt-4.1-mini';
      return undefined;
    });
    const dto = {
      text: 'Quiero evaluar credito hipotecario en UF',
      role: 'client' as const,
      sentAt: '2026-04-10T00:00:00.000Z',
      clientId: '11111111-1111-1111-1111-111111111111',
    };
    const createdClient = {
      id: 'm1',
      text: dto.text,
      role: dto.role,
      sentAt: new Date(dto.sentAt),
      clientId: dto.clientId,
      createdAt: new Date(),
    };
    prisma.message.create.mockResolvedValueOnce(createdClient);
    prisma.client.findUnique.mockResolvedValue({
      id: dto.clientId,
      salary: 1000000,
      debts: [{ amount: 3000000 }],
    });
    const createMock = jest
      .fn()
      .mockResolvedValue({ output_text: 'respuesta ia' });
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      responses: { create: createMock },
    }));

    await expect(service.create(dto)).resolves.toEqual(createdClient);
    expect(prisma.message.create).toHaveBeenCalledTimes(1);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('generates agent response when client already has previous messages', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'OPENAI_API_KEY') return 'test-key';
      if (key === 'OPENAI_MODEL') return 'gpt-4.1-mini';
      return undefined;
    });
    const dto = {
      text: 'Hola',
      role: 'client' as const,
      sentAt: '2026-04-10T00:00:00.000Z',
      clientId: '11111111-1111-1111-1111-111111111111',
    };
    const createdClient = {
      id: 'm1',
      text: dto.text,
      role: dto.role,
      sentAt: new Date(dto.sentAt),
      clientId: dto.clientId,
      createdAt: new Date(),
    };
    const createdAgent = {
      id: 'm2',
      text: 'respuesta ia',
      role: 'agent' as const,
      sentAt: new Date(),
      clientId: dto.clientId,
      createdAt: new Date(),
    };
    prisma.message.create
      .mockResolvedValueOnce(createdClient)
      .mockResolvedValueOnce(createdAgent);
    prisma.message.count.mockResolvedValue(1);
    prisma.message.findMany.mockResolvedValue([]);
    prisma.client.findUnique.mockResolvedValue({
      id: dto.clientId,
      salary: 1000000,
      debts: [],
    });
    const createMock = jest
      .fn()
      .mockResolvedValue({ output_text: 'respuesta ia' });
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      responses: { create: createMock },
    }));

    await expect(service.create(dto)).resolves.toEqual(createdClient);
    expect(prisma.message.create).toHaveBeenCalledTimes(2);
    expect(createMock).toHaveBeenCalled();
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

  it('returns AI response text from OpenAI', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'OPENAI_API_KEY') return 'test-key';
      if (key === 'OPENAI_MODEL') return 'gpt-4.1-mini';
      return undefined;
    });
    const createMock = jest
      .fn()
      .mockResolvedValue({ output_text: 'Respuesta IA' });
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      responses: { create: createMock },
    }));

    await expect(service.anwserWithAI('Hola')).resolves.toBe('Respuesta IA');
    expect(createMock).toHaveBeenCalledWith({
      model: 'gpt-4.1-mini',
      input: 'Hola',
    });
  });

  it('throws when OPENAI_API_KEY is missing', async () => {
    configService.get.mockReturnValue(undefined);
    await expect(service.anwserWithAI('Hola')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
