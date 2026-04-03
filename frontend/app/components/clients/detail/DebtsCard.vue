<script setup lang="ts">
import type { ClientDebtDTO } from '~/dtos';
import { formatDate, formatNumber } from '~/utils';

const props = defineProps<{
  debts: ClientDebtDTO[]
  loading: boolean
}>()

const sortedDebts = computed(() => {
  return [...(props.debts ?? [])]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
})
</script>

<template>
  <UCard class="bg-white dark:bg-neutral-900 rounded-2xl !border-0 !ring-0 !shadow-none">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-receipt-text" class="text-neutral-700 dark:text-neutral-200" />
        <h3 class="font-semibold">Deudas</h3>
      </div>
    </template>

    <USkeleton v-if="loading" class="h-24 w-full" />

    <div v-else-if="sortedDebts.length" class="space-y-2">
      <div
        v-for="debt in sortedDebts"
        :key="debt.id"
        class="rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 p-3"
      >
        <p class="font-medium">{{ debt.institution }}</p>
        <p class="text-sm text-muted mt-1">
          <span class="text-neutral-800 dark:text-neutral-100 font-semibold">{{ formatNumber(debt.amount) }}</span>
          • vence {{ formatDate(debt.dueDate) }}
        </p>
      </div>
    </div>

    <UAlert
      v-else
      color="neutral"
      variant="subtle"
      title="Este cliente no tiene deudas registradas."
    />
  </UCard>
</template>
