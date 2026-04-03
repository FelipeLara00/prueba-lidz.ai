export interface ClientDTO {
  id: string;
  name: string;
  rut: string;
  salary: number;
  savings: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientsListResponseDTO extends Array<ClientDTO> {}

export interface ClientDebtDTO {
  id: string;
  institution: string;
  amount: number;
  dueDate: string;
  clientId: string;
  createdAt: string;
}

export interface ClientMessageDTO {
  id: string;
  text: string;
  role: 'client' | 'agent';
  sentAt: string;
  clientId: string;
  createdAt: string;
}

export interface CreateClientDebtRequestDTO {
  institution: string;
  amount: number;
  dueDate: string;
}

export interface CreateClientMessageRequestDTO {
  text: string;
  role: 'client' | 'agent';
  sentAt: string;
}

export interface CreateClientRequestDTO {
  name: string;
  rut: string;
  salary: number;
  savings: number;
  debts?: CreateClientDebtRequestDTO[];
  messages?: CreateClientMessageRequestDTO[];
}

export interface UpdateClientRequestDTO {
  name?: string;
  rut?: string;
  salary?: number;
  savings?: number;
}

export interface ClientDetailDTO extends ClientDTO {
  debts: ClientDebtDTO[];
  messages: ClientMessageDTO[];
}

export type CreateClientResponseDTO = ClientDetailDTO;
export type GetClientByIdResponseDTO = ClientDetailDTO;
export type UpdateClientResponseDTO = ClientDTO;
export interface DeleteClientResponseDTO {
  deleted: boolean;
}
