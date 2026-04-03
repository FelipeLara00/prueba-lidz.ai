import { DebtsController } from './debts.controller';
import { CreateDebtDto, UpdateDebtDto } from './dto';

describe('DebtsController', () => {
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  let controller: DebtsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new DebtsController(service as never);
  });

  it('delegates create to service', async () => {
    const dto: CreateDebtDto = {
      institution: 'Bank',
      amount: 100,
      dueDate: '2026-04-10T00:00:00.000Z',
      clientId: '11111111-1111-1111-1111-111111111111',
    };
    service.create.mockResolvedValue({ id: 'd1', ...dto });

    await expect(controller.create(dto)).resolves.toEqual({ id: 'd1', ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('delegates findOne to service', async () => {
    service.findOne.mockResolvedValue({ id: 'd1' });

    await expect(controller.findOne('d1')).resolves.toEqual({ id: 'd1' });
    expect(service.findOne).toHaveBeenCalledWith('d1');
  });

  it('delegates update to service', async () => {
    const dto: UpdateDebtDto = { amount: 200 };
    service.update.mockResolvedValue({ id: 'd1', amount: 200 });

    await expect(controller.update('d1', dto)).resolves.toEqual({
      id: 'd1',
      amount: 200,
    });
    expect(service.update).toHaveBeenCalledWith('d1', dto);
  });
});
