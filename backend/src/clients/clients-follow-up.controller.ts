import { Controller, Param, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { Message } from '../messages/entities';

@ApiTags('follow-up')
@Controller()
export class ClientsFollowUpController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('client-to-do-follow-up/:id')
  @Post('clients-to-do-follow-up/:id')
  @ApiOperation({
    summary:
      'Genera follow up con IA para cliente por id, y decide envio segun reglas de negocio',
  })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: '#/components/schemas/Message' },
        {
          type: 'object',
          additionalProperties: false,
          example: {},
        },
      ],
    },
  })
  createFollowUp(
    @Param('id') id: string,
  ): Promise<Message | Record<string, never>> {
    return this.clientsService.clientToDoFollowUp(id);
  }
}
