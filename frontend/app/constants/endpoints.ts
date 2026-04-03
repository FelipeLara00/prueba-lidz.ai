export const ENDPOINT = {
  CLIENTS: {
    LIST: '/clients',
    CREATE: '/clients',
    GET_BY_ID: (id: string) => `/clients/${encodeURIComponent(id)}`,
    UPDATE: (id: string) => `/clients/${encodeURIComponent(id)}`,
    DELETE: (id: string) => `/clients/${encodeURIComponent(id)}`,
  },
  DEBTS: {
    LIST: '/debts',
    CREATE: '/debts',
    GET_BY_ID: (id: string) => `/debts/${encodeURIComponent(id)}`,
    UPDATE: (id: string) => `/debts/${encodeURIComponent(id)}`,
    DELETE: (id: string) => `/debts/${encodeURIComponent(id)}`,
  },
  MESSAGES: {
    LIST: '/messages',
    CREATE: '/messages',
    GET_BY_ID: (id: string) => `/messages/${encodeURIComponent(id)}`,
    UPDATE: (id: string) => `/messages/${encodeURIComponent(id)}`,
    DELETE: (id: string) => `/messages/${encodeURIComponent(id)}`,
  },
} as const;
