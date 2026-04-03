<script setup lang="ts">
import type { ClientDetailDTO } from '~/dtos';

const route = useRoute();
const clientsService = useClientsService();
const messagesService = useMessagesService();

const loading = ref(false);
const sendingMessage = ref(false);
const errorMessage = ref('');
const client = ref<ClientDetailDTO | null>(null);

async function loadClientDetails() {
  const clientId = String(route.params.id || '');

  if (!clientId) {
    errorMessage.value = 'ID de cliente invalido.';
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';
    client.value = null;
    client.value = await clientsService.getById(clientId);
  } catch {
    errorMessage.value = 'No se pudo cargar el detalle del cliente.';
  } finally {
    loading.value = false;
  }
}

async function handleSendMessage(payload: { text: string }) {
  if (!client.value) {
    return;
  }

  try {
    sendingMessage.value = true;
    await messagesService.create({
      text: payload.text,
      role: 'client',
      sentAt: new Date().toISOString(),
      clientId: client.value.id,
    });

    client.value = await clientsService.getById(client.value.id);
  } catch {
    errorMessage.value = 'No se pudo enviar el mensaje.';
  } finally {
    sendingMessage.value = false;
  }
}

watch(
  () => route.params.id,
  () => {
    loadClientDetails();
  },
  { immediate: true }
);
</script>

<template>
  <UContainer
    class="py-4 flex flex-col gap-4 lg:h-[calc(100dvh-var(--ui-header-height))] lg:overflow-hidden"
  >
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h1 class="text-xl font-semibold tracking-tight">Detalle del cliente</h1>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        @click="navigateTo('/clients')"
      >
        Volver
      </UButton>
    </div>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      :title="errorMessage"
    />

    <template v-if="client && !errorMessage">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:flex-1 lg:min-h-0">
        <div class="lg:col-span-4 space-y-4 md:space-y-6 lg:min-h-0">
          <ClientsDetailSummaryCards :client="client" />
          <ClientsDetailDebtsCard
            :debts="client.debts"
            :loading="loading"
          />
        </div>

        <div class="lg:col-span-8 min-h-[65dvh] lg:min-h-0">
          <ClientsDetailMessagesChatCard
            :messages="client.messages"
            :sending="sendingMessage"
            @submit-message="handleSendMessage"
          />
        </div>
      </div>
    </template>

    <USkeleton
      v-else-if="loading"
      class="h-72 w-full"
    />
  </UContainer>
</template>
