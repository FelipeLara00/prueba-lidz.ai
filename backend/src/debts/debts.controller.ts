import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto, UpdateDebtDto } from './dto';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtsService.create(createDebtDto);
  }

  @Get()
  findAll() {
    return this.debtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDebtDto: UpdateDebtDto,
  ) {
    return this.debtsService.update(id, updateDebtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.debtsService.remove(id);
    return { deleted: true };
  }
}
