<script setup lang="ts">
import type { ClientDTO } from '~/dtos'

defineProps<{
  clients: ClientDTO[]
  columns: { accessorKey: string, header: string }[]
  loading: boolean
}>()

const emit = defineEmits<{
  reload: []
  rowSelect: [event: Event, row: { original: ClientDTO }]
}>()
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <h3 class="font-semibold">Tabla de clientes</h3>
        <UButton color="neutral" variant="ghost" :loading="loading" @click="emit('reload')">
          Recargar
        </UButton>
      </div>
    </template>

    <UTable
      :data="clients"
      :columns="columns"
      :loading="loading"
      empty="Sin clientes cargados."
      :on-select="(event: Event, row: { original: ClientDTO }) => emit('rowSelect', event, row)"
    />
  </UCard>
</template>
