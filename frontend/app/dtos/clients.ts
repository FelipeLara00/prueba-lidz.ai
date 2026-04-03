export interface ClientDTO {
  id: string
  name: string
  rut: string
  salary: number
  savings: number
  createdAt: string
  updatedAt: string
}

export interface ClientsListResponseDTO extends Array<ClientDTO> {}

export interface CreateClientRequestDTO {
  name: string
  rut: string
  salary: number
  savings: number
}

export interface UpdateClientRequestDTO {
  name?: string
  rut?: string
  salary?: number
  savings?: number
}

export type CreateClientResponseDTO = ClientDTO
export type GetClientByIdResponseDTO = ClientDTO
export type UpdateClientResponseDTO = ClientDTO
export interface DeleteClientResponseDTO {
  deleted: boolean
}
