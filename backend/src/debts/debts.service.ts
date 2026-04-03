import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateDebtDto, UpdateDebtDto } from './dto';
import { Debt } from './entities';

@Injectable()
export class DebtsService {
  private readonly debts: Debt[] = [];

  create(createDebtDto: CreateDebtDto): Debt {
    try {
      const debt: Debt = {
        id: randomUUID(),
        institution: createDebtDto.institution,
        amount: createDebtDto.amount,
        dueDate: createDebtDto.dueDate,
        clientId: createDebtDto.clientId,
        createdAt: new Date(),
      };
      this.debts.push(debt);
      return debt;
    } catch (error) {
      this.handleError(error);
    }
  }

  findAll(): Debt[] {
    try {
      return this.debts;
    } catch (error) {
      this.handleError(error);
    }
  }

  findOne(id: string): Debt {
    try {
      const debt = this.debts.find((item) => item.id === id);
      if (!debt) {
        throw new NotFoundException(`Debt with id ${id} was not found`);
      }
      return debt;
    } catch (error) {
      this.handleError(error);
    }
  }

  update(id: string, updateDebtDto: UpdateDebtDto): Debt {
    try {
      const debt = this.findOne(id);
      Object.assign(debt, updateDebtDto);
      return debt;
    } catch (error) {
      this.handleError(error);
    }
  }

  remove(id: string): void {
    try {
      const debtIndex = this.debts.findIndex((item) => item.id === id);
      if (debtIndex === -1) {
        throw new NotFoundException(`Debt with id ${id} was not found`);
      }
      this.debts.splice(debtIndex, 1);
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
