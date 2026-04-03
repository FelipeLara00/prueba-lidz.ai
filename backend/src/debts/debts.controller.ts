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
import { DebtsService } from './debts.service';
import { CreateDebtDto, UpdateDebtDto } from './dto';
import { Debt } from './entities';

@ApiTags('debts')
@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear deuda' })
  @ApiBody({ type: CreateDebtDto })
  @ApiOkResponse({ type: Debt })
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtsService.create(createDebtDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar deudas' })
  @ApiOkResponse({ type: Debt, isArray: true })
  findAll() {
    return this.debtsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener deuda por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ type: Debt })
  findOne(@Param('id') id: string) {
    return this.debtsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar deuda por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateDebtDto })
  @ApiOkResponse({ type: Debt })
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtsService.update(id, updateDebtDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar deuda por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean', example: true },
      },
    },
  })
  async remove(@Param('id') id: string) {
    await this.debtsService.remove(id);
    return { deleted: true };
  }
}
