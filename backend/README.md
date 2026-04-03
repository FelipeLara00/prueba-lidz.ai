# Backend - Prueba Tencina Lidz.ai

API REST en NestJS + Prisma (SQLite) para gestionar clientes, deudas y mensajes.

## Stack

- NestJS 11
- Prisma 7 + SQLite (`better-sqlite3` adapter)
- Class Validator / Class Transformer
- OpenAI SDK (Responses API)

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
```

## Variables de entorno

Crear/editar `backend/.env`:

```env
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4.1-mini"
```

Notas:
- La base SQLite se usa como `backend/dev.db` desde `PrismaService`.
- `OPENAI_API_KEY` es obligatoria para respuesta automática IA.

## Base de datos

Aplicar migraciones:

```bash
npx prisma migrate dev
```

Cargar seed:

```bash
npm run db:seed
```

## Ejecutar

```bash
# desarrollo
npm run start:dev

# build
npm run build

# producción
npm run start:prod
```

API en: `http://localhost:3001`

## CORS

Permitido para:
- `http://localhost:<puerto>`
- `http://127.0.0.1:<puerto>`

## Swagger

La API está documentada con Swagger.

- UI Swagger: `http://localhost:3001/api/docs`
- OpenAPI JSON: `http://localhost:3001/api/docs-json`

## Endpoints

### Clients
- `POST /clients`
- `GET /clients`
- `GET /clients/:id`
- `PATCH /clients/:id`
- `DELETE /clients/:id`

### Debts
- `POST /debts`
- `GET /debts`
- `GET /debts/:id`
- `PATCH /debts/:id`
- `DELETE /debts/:id`

### Messages
- `POST /messages`
- `GET /messages`
- `GET /messages/:id`
- `PATCH /messages/:id`
- `DELETE /messages/:id`

## Reglas de respuesta IA (messages)

Al crear mensaje:
- Solo se permite creación manual con `role: "client"`.
- Si el cliente ya tiene historial de mensajes, responde sí o sí.
- Si es el primer mensaje, se evalúan reglas:
  - keywords inmobiliarias (Chile),
  - relación deuda/renta (si deuda total >= 3x renta, no responde).
- Si responde, se genera automáticamente mensaje `role: "agent"`.

El prompt considera:
- renta,
- ahorros,
- deuda total,
- historial de mensajes,
- mensaje actual.

## Tests

```bash
npm run test
npm run test:cov
```

Para el servicio de mensajes:

```bash
npm test -- src/messages/messages.service.spec.ts --runInBand
```
