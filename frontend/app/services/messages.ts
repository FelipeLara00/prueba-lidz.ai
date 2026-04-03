import { ENDPOINT } from '~/constants/endpoints'
import type {
  CreateMessageRequestDTO,
  CreateMessageResponseDTO,
  DeleteMessageResponseDTO,
  GetMessageByIdResponseDTO,
  MessagesListResponseDTO,
  UpdateMessageRequestDTO,
  UpdateMessageResponseDTO
} from '~/dtos'

const useMessagesService = () => {
  const { $api } = useNuxtApp()

  const list = () => {
    return $api<MessagesListResponseDTO>(ENDPOINT.MESSAGES.LIST)
  }

  const getById = (id: string) => {
    return $api<GetMessageByIdResponseDTO>(ENDPOINT.MESSAGES.GET_BY_ID(id))
  }

  const create = (payload: CreateMessageRequestDTO) => {
    return $api<CreateMessageResponseDTO>(ENDPOINT.MESSAGES.CREATE, {
      method: 'POST',
      body: payload
    })
  }

  const update = (id: string, payload: UpdateMessageRequestDTO) => {
    return $api<UpdateMessageResponseDTO>(ENDPOINT.MESSAGES.UPDATE(id), {
      method: 'PATCH',
      body: payload
    })
  }

  const remove = (id: string) => {
    return $api<DeleteMessageResponseDTO>(ENDPOINT.MESSAGES.DELETE(id), {
      method: 'DELETE'
    })
  }

  return { list, getById, create, update, remove }
}

export { useMessagesService }
