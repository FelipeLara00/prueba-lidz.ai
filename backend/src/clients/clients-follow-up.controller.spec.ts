import { ClientsFollowUpController } from './clients-follow-up.controller';

describe('ClientsFollowUpController', () => {
  const service = {
    clientToDoFollowUp: jest.fn(),
  };

  let controller: ClientsFollowUpController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ClientsFollowUpController(service as never);
  });

  it('delegates follow-up generation to service', async () => {
    const response = {
      id: 'm1',
      text: 'Hola, quieres retomar la conversacion?',
      role: 'agent',
      sentAt: new Date('2026-04-03T15:00:00.000Z'),
      clientId: '11111111-1111-1111-1111-111111111111',
      createdAt: new Date('2026-04-03T15:00:00.000Z'),
    };
    service.clientToDoFollowUp.mockResolvedValue(response);

    await expect(controller.createFollowUp(response.clientId)).resolves.toEqual(
      response,
    );
    expect(service.clientToDoFollowUp).toHaveBeenCalledWith(response.clientId);
  });

  it('returns empty object when follow-up is not sent', async () => {
    service.clientToDoFollowUp.mockResolvedValue({});

    await expect(controller.createFollowUp('c1')).resolves.toEqual({});
    expect(service.clientToDoFollowUp).toHaveBeenCalledWith('c1');
  });
});
