import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { Message } from './entities';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear mensaje (manual solo role=client)' })
  @ApiBody({ type: CreateMessageDto })
  @ApiOkResponse({ type: Message })
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mensajes' })
  @ApiOkResponse({ type: Message, isArray: true })
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener mensaje por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ type: Message })
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar mensaje por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateMessageDto })
  @ApiOkResponse({ type: Message })
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar mensaje por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean', example: true },
      },
    },
  })
  remove(@Param('id') id: string) {
    this.messagesService.remove(id);
    return { deleted: true };
  }
}
