import { MessagesController } from './messages.controller';
import { CreateMessageDto, UpdateMessageDto } from './dto';

describe('MessagesController', () => {
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  let controller: MessagesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new MessagesController(service as never);
  });

  it('delegates create to service', async () => {
    const dto: CreateMessageDto = {
      text: 'hola',
      role: 'client',
      sentAt: '2026-04-10T00:00:00.000Z',
      clientId: '11111111-1111-1111-1111-111111111111',
    };
    service.create.mockResolvedValue({ id: 'm1', ...dto });

    await expect(controller.create(dto)).resolves.toEqual({ id: 'm1', ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('delegates findAll to service', async () => {
    service.findAll.mockResolvedValue([{ id: 'm1' }]);

    await expect(controller.findAll()).resolves.toEqual([{ id: 'm1' }]);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('delegates update to service', async () => {
    const dto: UpdateMessageDto = { text: 'nuevo' };
    service.update.mockResolvedValue({ id: 'm1', text: 'nuevo' });

    await expect(controller.update('m1', dto)).resolves.toEqual({
      id: 'm1',
      text: 'nuevo',
    });
    expect(service.update).toHaveBeenCalledWith('m1', dto);
  });
});
