export interface DebtDTO {
  id: string
  institution: string
  amount: number
  dueDate: string
  clientId: string
  createdAt: string
}

export interface DebtsListResponseDTO extends Array<DebtDTO> {}

export interface CreateDebtRequestDTO {
  institution: string
  amount: number
  dueDate: string
  clientId: string
}

export interface UpdateDebtRequestDTO {
  institution?: string
  amount?: number
  dueDate?: string
  clientId?: string
}

export type CreateDebtResponseDTO = DebtDTO
export type GetDebtByIdResponseDTO = DebtDTO
export type UpdateDebtResponseDTO = DebtDTO
export interface DeleteDebtResponseDTO {
  deleted: boolean
}
