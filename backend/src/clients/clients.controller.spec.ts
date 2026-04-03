import { ClientsController } from './clients.controller';
import { CreateClientDto, UpdateClientDto } from './dto';

describe('ClientsController', () => {
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  let controller: ClientsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ClientsController(service as never);
  });

  it('delegates create to service', async () => {
    const dto: CreateClientDto = {
      name: 'Ana',
      rut: '11-1',
      salary: 1000,
      savings: 100,
    };
    service.create.mockResolvedValue({ id: 'c1', ...dto });

    await expect(controller.create(dto)).resolves.toEqual({ id: 'c1', ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('delegates update to service', async () => {
    const dto: UpdateClientDto = { savings: 500 };
    service.update.mockResolvedValue({ id: 'c1', savings: 500 });

    await expect(controller.update('c1', dto)).resolves.toEqual({
      id: 'c1',
      savings: 500,
    });
    expect(service.update).toHaveBeenCalledWith('c1', dto);
  });

  it('calls remove and returns deleted true', () => {
    const result = controller.remove('c1');

    expect(service.remove).toHaveBeenCalledWith('c1');
    expect(result).toEqual({ deleted: true });
  });
});
