import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { Message } from './entities';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  private readonly aiTriggerKeywords = [
    'uf',
    'credito',
    'credito hipotecario',
    'hipotecario',
    'hipoteca',
    'pie',
    'propiedad',
    'dividendo',
    'tasa',
    'cae',
    'mutuo',
    'preaprobacion',
    'inmobiliaria',
    'subsidio',
    'ds19',
    'escritura',
    'notaria',
    'tasacion',
    'conservador',
    'bien raiz',
    'compraventa',
    'arriendo',
    'arrendar',
    'arrendatario',
    'arrendador',
    'pieza',
    'piezas',
    'dormitorio',
    'dormitorios',
    'metro cuadrado',
    'metros cuadrados',
    'mt2',
    'm2',
    'superficie',
    'calle',
    'avenida',
    'pasaje',
    'comuna',
    'barrio',
    'corredora',
    'corredor',
    'broker',
    'agente',
    'agente inmobiliario',
    'propiedad',
    'propiedades',
    'departamento',
    'departamentos',
    'casa',
    'casas',
    'terreno',
    'terrenos',
    'parcela',
    'parcelas',
    'condominio',
    'edificio',
    'gastos comunes',
    'canon de arriendo',
    'promesa',
    'promesa de compraventa',
    'leasing habitacional',
    'credito puente',
    'alzamiento',
    'garantia hipotecaria',
    'aval',
    'codeudor',
    'comprar',
    'vender',
    'arrendar',
    'arriendar',
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      if (createMessageDto.role !== 'client') {
        throw new BadRequestException(
          'Only client messages can be created manually',
        );
      }

      const createdClientMessage = await this.prisma.message.create({
        data: {
          ...createMessageDto,
          sentAt: new Date(createMessageDto.sentAt),
        },
      });

      const shouldReply = await this.applyRules(
        createMessageDto.text,
        createMessageDto.clientId,
        createdClientMessage.id,
      );

      if (shouldReply) {
        try {
          const prompt = await this.buildPrompt(
            createMessageDto.clientId,
            createdClientMessage.id,
            createMessageDto.text,
          );
          const aiResponse = await this.anwserWithAI(prompt);

          if (aiResponse) {
            await this.prisma.message.create({
              data: {
                text: aiResponse,
                role: 'agent',
                sentAt: new Date(),
                clientId: createMessageDto.clientId,
              },
            });
          }
        } catch (error) {
          // IA response is best-effort: client message should still be created.
        }
      }

      return createdClientMessage;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(): Promise<Message[]> {
    try {
      return await this.prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string): Promise<Message> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
      });
      if (!message) {
        throw new NotFoundException(`Message with id ${id} was not found`);
      }
      return message;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    try {
      await this.findOne(id);
      return await this.prisma.message.update({
        where: { id },
        data: {
          ...updateMessageDto,
          ...(updateMessageDto.sentAt
            ? { sentAt: new Date(updateMessageDto.sentAt) }
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
      await this.prisma.message.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async anwserWithAI(message: string): Promise<string> {
    try {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');
      const model =
        this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4.1-mini';

      if (!apiKey) {
        throw new InternalServerErrorException(
          'OPENAI_API_KEY is not configured',
        );
      }

      const client = new OpenAI({ apiKey });
      const response = await client.responses.create({
        model,
        input: message,
      });

      const outputText = response.output_text;

      if (!outputText) {
        throw new InternalServerErrorException(
          'OpenAI returned empty response',
        );
      }

      return outputText;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error in AI response');
    }
  }

  private async applyRules(
    message: string,
    clientId: string,
    latestMessageId: string,
  ): Promise<boolean> {
    const previousMessagesCount = await this.prisma.message.count({
      where: {
        clientId,
        id: { not: latestMessageId },
      },
    });

    if (previousMessagesCount > 0) {
      return true;
    }

    const normalized = message
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    const keywordMatch = this.aiTriggerKeywords.some((keyword) => {
      if (keyword === 'uf') {
        return /\buf\b/.test(normalized);
      }
      return normalized.includes(keyword);
    });

    if (!keywordMatch) {
      return false;
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        debts: {
          select: {
            amount: true,
          },
        },
      },
    });

    if (!client) {
      return false;
    }

    const totalDebt = client.debts.reduce((sum, debt) => sum + debt.amount, 0);
    const debtLimit = client.salary * 3;

    return totalDebt < debtLimit;
  }

  private async buildPrompt(
    clientId: string,
    latestMessageId: string,
    clientMessage: string,
  ): Promise<string> {
    const [client, previousMessages] = await Promise.all([
      this.prisma.client.findUnique({
        where: { id: clientId },
        include: {
          debts: {
            select: { amount: true },
          },
        },
      }),
      this.prisma.message.findMany({
        where: {
          clientId,
          id: { not: latestMessageId },
        },
        orderBy: { sentAt: 'asc' },
        select: {
          role: true,
          text: true,
          sentAt: true,
        },
      }),
    ]);

    const salary = client?.salary ?? 0;
    const savings = client?.savings ?? 0;
    const totalDebt =
      client?.debts.reduce((sum, debt) => sum + debt.amount, 0) ?? 0;

    const historyText = previousMessages.length
      ? previousMessages
          .map(
            (message) =>
              `[${message.role}] (${message.sentAt.toISOString()}): ${message.text}`,
          )
          .join('\n')
      : 'Sin mensajes previos.';

    return [
      'Responde como un asesor inmobiliario breve y claro en español.',
      'No inventes datos.',
      'Contexto financiero del cliente:',
      `- Renta mensual: ${salary}`,
      `- Ahorros: ${savings}`,
      `- Deuda total: ${totalDebt}`,
      'Mensajes anteriores de la conversación (para contexto):',
      historyText,
      `Mensaje actual del cliente: ${clientMessage}`,
    ].join('\n');
  }

  private handleError(error: unknown): never {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }
    throw new InternalServerErrorException(
      'Unexpected error in messages service',
    );
  }
}
