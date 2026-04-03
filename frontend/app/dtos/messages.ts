export interface MessageDTO {
  id: string
  text: string
  role: 'client' | 'agent'
  sentAt: string
  clientId: string
  createdAt: string
}

export interface MessagesListResponseDTO extends Array<MessageDTO> {}

export interface CreateMessageRequestDTO {
  text: string
  role: 'client' | 'agent'
  sentAt: string
  clientId: string
}

export interface UpdateMessageRequestDTO {
  text?: string
  role?: 'client' | 'agent'
  sentAt?: string
  clientId?: string
}

export type CreateMessageResponseDTO = MessageDTO
export type GetMessageByIdResponseDTO = MessageDTO
export type UpdateMessageResponseDTO = MessageDTO
export interface DeleteMessageResponseDTO {
  deleted: boolean
}
