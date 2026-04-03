export const ENDPOINTS = {
  clients: '/clients',
  clientsCreate: '/clients',
  clientsGetById: (id: string) => `/clients/${encodeURIComponent(id)}`,
  clientsUpdate: (id: string) => `/clients/${encodeURIComponent(id)}`,
  clientsDelete: (id: string) => `/clients/${encodeURIComponent(id)}`,

  debts: '/debts',
  debtsCreate: '/debts',
  debtsGetById: (id: string) => `/debts/${encodeURIComponent(id)}`,
  debtsUpdate: (id: string) => `/debts/${encodeURIComponent(id)}`,
  debtsDelete: (id: string) => `/debts/${encodeURIComponent(id)}`,

  messages: '/messages',
  messagesCreate: '/messages',
  messagesGetById: (id: string) => `/messages/${encodeURIComponent(id)}`,
  messagesUpdate: (id: string) => `/messages/${encodeURIComponent(id)}`,
  messagesDelete: (id: string) => `/messages/${encodeURIComponent(id)}`
} as const
