<script setup lang="ts">
import type { ClientDTO, DebtDTO, MessageDTO } from '~/dtos';

const open = defineModel<boolean>('open', { required: true });

defineProps<{
  loading: boolean;
  client: ClientDTO | null;
  debts: DebtDTO[];
  messages: MessageDTO[];
}>();

const debtColumns = [
  { accessorKey: 'institution', header: 'Institucion' },
  { accessorKey: 'amount', header: 'Monto' },
  { accessorKey: 'dueDate', header: 'Vencimiento' },
];

const messageColumns = [
  { accessorKey: 'role', header: 'Rol' },
  { accessorKey: 'text', header: 'Mensaje' },
  { accessorKey: 'sentAt', header: 'Enviado' },
];
</script>

<template>
  <UModal
    v-model:open="open"
    title="Detalle de cliente"
    :ui="{ content: 'max-w-4xl' }"
  >
    <template #body>
      <div class="space-y-4">
        <UAlert
          v-if="!client"
          color="warning"
          variant="subtle"
          title="Selecciona un cliente para ver su detalle."
        />

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <UCard>
            <template #header>
              <p class="text-sm text-muted">Nombre</p>
            </template>
            <p class="font-semibold">
              {{ client.name }}
            </p>
          </UCard>

          <UCard>
            <template #header>
              <p class="text-sm text-muted">RUT</p>
            </template>
            <p class="font-semibold">
              {{ client.rut }}
            </p>
          </UCard>
        </div>

        <UCard>
          <template #header>
            <h4 class="font-semibold">Deudas</h4>
          </template>
          <UTable
            :data="debts"
            :columns="debtColumns"
            :loading="loading"
            empty="Este cliente no tiene deudas."
          />
        </UCard>

        <UCard>
          <template #header>
            <h4 class="font-semibold">Mensajes</h4>
          </template>
          <UTable
            :data="messages"
            :columns="messageColumns"
            :loading="loading"
            empty="Este cliente no tiene mensajes."
          />
        </UCard>
      </div>
    </template>
  </UModal>
</template>
