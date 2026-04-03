import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDebtDto, UpdateDebtDto } from './dto';
import { Debt } from './entities';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDebtDto: CreateDebtDto): Promise<Debt> {
    try {
      return await this.prisma.debt.create({
        data: {
          ...createDebtDto,
          dueDate: new Date(createDebtDto.dueDate),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(): Promise<Debt[]> {
    try {
      return await this.prisma.debt.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string): Promise<Debt> {
    try {
      const debt = await this.prisma.debt.findUnique({
        where: { id },
      });
      if (!debt) {
        throw new NotFoundException(`Debt with id ${id} was not found`);
      }
      return debt;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, updateDebtDto: UpdateDebtDto): Promise<Debt> {
    try {
      await this.findOne(id);
      return await this.prisma.debt.update({
        where: { id },
        data: {
          ...updateDebtDto,
          ...(updateDebtDto.dueDate
            ? { dueDate: new Date(updateDebtDto.dueDate) }
            : {}),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.prisma.debt.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Unexpected error in debts service');
  }
}
