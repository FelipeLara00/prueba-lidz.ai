<script setup lang="ts">
import type { ClientDetailDTO } from '~/dtos'

const route = useRoute()
const clientsService = useClientsService()

const loading = ref(false)
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
    client.value = await clientsService.getById(clientId)
  } catch {
    errorMessage.value = 'No se pudo cargar el detalle del cliente.'
  } finally {
    loading.value = false
  }
}

onMounted(loadClientDetails)
</script>

<template>
  <UContainer class="py-8 space-y-6">
    <ClientsDetailHeaderBar />

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      :title="errorMessage"
    />

    <template v-if="client">
      <ClientsDetailSummaryCards :client="client" />
      <ClientsDetailDebtsCard :debts="client.debts" :loading="loading" />
      <ClientsDetailMessagesChatCard :messages="client.messages" />
    </template>

    <USkeleton v-else-if="loading" class="h-72 w-full" />
  </UContainer>
</template>
