<script setup lang="ts">
import { formatNumber } from '~/utils';

defineProps<{
  totalClients: number;
  totalSalary: number;
  totalSavings: number;
}>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <UCard class="bg-white dark:bg-neutral-900 rounded-2xl !border-0 !ring-0 !shadow-none">
      <template #header>
        <p class="text-sm text-muted">Total clientes</p>
      </template>
      <p class="text-2xl font-semibold">
        {{ totalClients }}
      </p>
    </UCard>

    <UCard class="bg-white dark:bg-neutral-900 rounded-2xl !border-0 !ring-0 !shadow-none">
      <template #header>
        <p class="text-sm text-muted">Sueldo acumulado</p>
      </template>
      <p class="text-2xl font-semibold">${{ formatNumber(totalSalary) }}</p>
    </UCard>

    <UCard class="bg-white dark:bg-neutral-900 rounded-2xl !border-0 !ring-0 !shadow-none">
      <template #header>
        <p class="text-sm text-muted">Ahorros acumulados</p>
      </template>
      <p class="text-2xl font-semibold">${{ formatNumber(totalSavings) }}</p>
    </UCard>
  </div>
</template>
