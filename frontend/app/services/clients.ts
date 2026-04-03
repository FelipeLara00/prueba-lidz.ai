import { ENDPOINT } from '~/constants/endpoints'
import type {
  ClientsListResponseDTO,
  CreateClientRequestDTO,
  CreateClientResponseDTO,
  DeleteClientResponseDTO,
  GetClientByIdResponseDTO,
  UpdateClientRequestDTO,
  UpdateClientResponseDTO
} from '~/dtos'

const useClientsService = () => {
  const { $api } = useNuxtApp()

  const list = () => {
    return $api<ClientsListResponseDTO>(ENDPOINT.CLIENTS.LIST)
  }

  const getById = (id: string) => {
    return $api<GetClientByIdResponseDTO>(ENDPOINT.CLIENTS.GET_BY_ID(id))
  }

  const create = (payload: CreateClientRequestDTO) => {
    return $api<CreateClientResponseDTO>(ENDPOINT.CLIENTS.CREATE, {
      method: 'POST',
      body: payload
    })
  }

  const update = (id: string, payload: UpdateClientRequestDTO) => {
    return $api<UpdateClientResponseDTO>(ENDPOINT.CLIENTS.UPDATE(id), {
      method: 'PATCH',
      body: payload
    })
  }

  const remove = (id: string) => {
    return $api<DeleteClientResponseDTO>(ENDPOINT.CLIENTS.DELETE(id), {
      method: 'DELETE'
    })
  }

  return { list, getById, create, update, remove }
}

export { useClientsService }
