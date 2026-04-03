import { ENDPOINT } from '~/constants/endpoints'
import type {
  CreateDebtRequestDTO,
  CreateDebtResponseDTO,
  DebtsListResponseDTO,
  DeleteDebtResponseDTO,
  GetDebtByIdResponseDTO,
  UpdateDebtRequestDTO,
  UpdateDebtResponseDTO
} from '~/dtos'

const useDebtsService = () => {
  const { $api } = useNuxtApp()

  const list = () => {
    return $api<DebtsListResponseDTO>(ENDPOINT.DEBTS.LIST)
  }

  const getById = (id: string) => {
    return $api<GetDebtByIdResponseDTO>(ENDPOINT.DEBTS.GET_BY_ID(id))
  }

  const create = (payload: CreateDebtRequestDTO) => {
    return $api<CreateDebtResponseDTO>(ENDPOINT.DEBTS.CREATE, {
      method: 'POST',
      body: payload
    })
  }

  const update = (id: string, payload: UpdateDebtRequestDTO) => {
    return $api<UpdateDebtResponseDTO>(ENDPOINT.DEBTS.UPDATE(id), {
      method: 'PATCH',
      body: payload
    })
  }

  const remove = (id: string) => {
    return $api<DeleteDebtResponseDTO>(ENDPOINT.DEBTS.DELETE(id), {
      method: 'DELETE'
    })
  }

  return { list, getById, create, update, remove }
}

export { useDebtsService }
