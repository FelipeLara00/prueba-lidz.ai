<script setup lang="ts">
import type { ClientDetailDTO } from '~/dtos'

const route = useRoute()
const clientsService = useClientsService()
const messagesService = useMessagesService()

const loading = ref(false)
const sendingMessage = ref(false)
const errorMessage = ref('')
const client = ref<ClientDetailDTO | null>(null)

async function loadClientDetails() {
  const clientId = String(route.params.id || '')

  if (!clientId) {
    errorMessage.value = 'ID de cliente invalido.'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''
    client.value = null
    client.value = await clientsService.getById(clientId)
  } catch {
    errorMessage.value = 'No se pudo cargar el detalle del cliente.'
  } finally {
    loading.value = false
  }
}

async function handleSendMessage(payload: { text: string; role: 'client' | 'agent' }) {
  if (!client.value) {
    return
  }

  try {
    sendingMessage.value = true
    const createdMessage = await messagesService.create({
      text: payload.text,
      role: payload.role,
      sentAt: new Date().toISOString(),
      clientId: client.value.id
    })

    client.value = {
      ...client.value,
      messages: [...client.value.messages, createdMessage]
    }
  } catch {
    errorMessage.value = 'No se pudo enviar el mensaje.'
  } finally {
    sendingMessage.value = false
  }
}

watch(
  () => route.params.id,
  () => {
    loadClientDetails()
  },
  { immediate: true }
)
</script>

<template>
  <UContainer class="py-4 h-[calc(100dvh-var(--ui-header-height))] overflow-hidden flex flex-col gap-4">
    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      :title="errorMessage"
    />

    <template v-if="client && !errorMessage">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div class="lg:col-span-4 space-y-6 min-h-0">
          <ClientsDetailSummaryCards :client="client" />
          <ClientsDetailDebtsCard :debts="client.debts" :loading="loading" />
        </div>

        <div class="lg:col-span-8 min-h-0">
          <ClientsDetailMessagesChatCard
            :messages="client.messages"
            :sending="sendingMessage"
            @submit-message="handleSendMessage"
          />
        </div>
      </div>
    </template>

    <USkeleton v-else-if="loading" class="h-72 w-full" />
  </UContainer>
</template>
