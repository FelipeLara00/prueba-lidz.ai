import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { join } from 'path';

const adapter = new PrismaBetterSqlite3({
  url: `file:${join(process.cwd(), 'dev.db')}`,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.message.deleteMany();
  await prisma.debt.deleteMany();
  await prisma.client.deleteMany();

  await prisma.client.create({
    data: {
      name: 'Ana Torres',
      rut: '12.345.678-5',
      salary: 1850000,
      savings: 4200000,
      debts: {
        create: [
          {
            institution: 'Banco Estado',
            amount: 1200000,
            dueDate: new Date('2026-06-10T00:00:00.000Z'),
          },
          {
            institution: 'CMR Falabella',
            amount: 320000,
            dueDate: new Date('2026-05-22T00:00:00.000Z'),
          },
        ],
      },
      messages: {
        create: [
          {
            role: 'client',
            text: 'Necesito evaluar si me conviene refinanciar.',
            sentAt: new Date('2026-04-01T13:10:00.000Z'),
          },
          {
            role: 'agent',
            text: 'Perfecto, revisemos ingresos, ahorros y deuda total.',
            sentAt: new Date('2026-04-01T13:12:00.000Z'),
          },
        ],
      },
    },
  });

  await prisma.client.create({
    data: {
      name: 'Carlos Rojas',
      rut: '16.223.451-9',
      salary: 2400000,
      savings: 980000,
      debts: {
        create: [
          {
            institution: 'Santander',
            amount: 2850000,
            dueDate: new Date('2026-07-15T00:00:00.000Z'),
          },
        ],
      },
      messages: {
        create: [
          {
            role: 'client',
            text: 'Quiero ver opciones para consolidar deudas.',
            sentAt: new Date('2026-04-02T10:05:00.000Z'),
          },
          {
            role: 'agent',
            text: 'Te propongo simular una consolidación a 36 meses.',
            sentAt: new Date('2026-04-02T10:06:00.000Z'),
          },
          {
            role: 'client',
            text: 'Avancemos con esa simulación.',
            sentAt: new Date('2026-04-02T10:08:00.000Z'),
          },
        ],
      },
    },
  });

  await prisma.client.create({
    data: {
      name: 'María Pérez',
      rut: '9.876.543-2',
      salary: 1250000,
      savings: 6100000,
      debts: {
        create: [
          {
            institution: 'Scotiabank',
            amount: 450000,
            dueDate: new Date('2026-05-05T00:00:00.000Z'),
          },
          {
            institution: 'Lider BCI',
            amount: 215000,
            dueDate: new Date('2026-04-28T00:00:00.000Z'),
          },
        ],
      },
      messages: {
        create: [
          {
            role: 'agent',
            text: 'Tienes buen nivel de ahorro para prepagar tu deuda.',
            sentAt: new Date('2026-04-03T09:30:00.000Z'),
          },
          {
            role: 'client',
            text: 'Me interesa prepagar una parte este mes.',
            sentAt: new Date('2026-04-03T09:33:00.000Z'),
          },
        ],
      },
    },
  });

  const [clients, debts, messages] = await Promise.all([
    prisma.client.count(),
    prisma.debt.count(),
    prisma.message.count(),
  ]);

  console.log(`Seed OK -> clients: ${clients}, debts: ${debts}, messages: ${messages}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
