# Frontend - Prueba Tencina Lidz.ai

Aplicación Nuxt 4 + Nuxt UI para flujo de clientes y conversación con agente.

## Stack

- Nuxt 4
- Nuxt UI 4
- Tailwind CSS 4
- TypeScript

## Requisitos

- Node.js 20+
- npm 10+ (o pnpm 10+)

## Instalación

```bash
npm install
```

## Variables de entorno

Crear `frontend/.env`:

```env
BACKEND_URL="http://localhost:3001"
```

`nuxt.config.ts` expone esta variable como `runtimeConfig.public.apiBaseUrl`.

## Ejecutar

```bash
# desarrollo
npm run dev

# typecheck
npm run typecheck

# build
npm run build

# preview
npm run preview
```

App en: `http://localhost:3000`

## Arquitectura de consumo API

- Plugin fetch: `app/plugins/api.ts`
  - Provee `$api` con `baseURL` desde `BACKEND_URL`.
- Endpoints centralizados: `app/constants/endpoints.ts`
- Servicios auto-importados desde `app/services/**` (configurado en `nuxt.config.ts`):
  - `clients.ts`
  - `debts.ts`
  - `messages.ts`

## Vistas principales

- `/clients`
  - Landing con tabla y métricas.
- `/clients/new`
  - Flujo de iniciar conversación (datos, deudas opcionales, primer mensaje).
- `/clients/:id`
  - Detalle del cliente + deudas + chat con envío de mensajes cliente.

## Flujo funcional

1. Se crea cliente con datos financieros y opcionalmente deudas.
2. Se envía el primer mensaje del cliente.
3. Se redirige a la vista detalle.
4. En chat, cada nuevo mensaje del cliente puede disparar respuesta automática IA (backend).

## Utilidades

En `app/utils`:

- formateo de RUT,
- fechas,
- números con separador de miles.
