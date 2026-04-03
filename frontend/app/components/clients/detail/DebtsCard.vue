<script setup lang="ts">
import type { ClientDebtDTO } from '~/dtos'

defineProps<{
  debts: ClientDebtDTO[]
  loading: boolean
}>()

const debtColumns = [
  { accessorKey: 'institution', header: 'Institucion' },
  { accessorKey: 'amount', header: 'Monto' },
  { accessorKey: 'dueDate', header: 'Vencimiento' }
]
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="font-semibold">Deudas</h3>
    </template>
    <UTable
      :data="debts"
      :columns="debtColumns"
      :loading="loading"
      empty="Este cliente no tiene deudas."
    />
  </UCard>
</template>
