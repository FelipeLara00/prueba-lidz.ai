<script setup lang="ts">
defineProps<{
  totalClients: number
  totalSalary: number
  totalSavings: number
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <UCard>
      <template #header>
        <p class="text-sm text-muted">Total clientes</p>
      </template>
      <p class="text-2xl font-semibold">{{ totalClients }}</p>
    </UCard>

    <UCard>
      <template #header>
        <p class="text-sm text-muted">Sueldo acumulado</p>
      </template>
      <p class="text-2xl font-semibold">{{ totalSalary }}</p>
    </UCard>

    <UCard>
      <template #header>
        <p class="text-sm text-muted">Ahorros acumulados</p>
      </template>
      <p class="text-2xl font-semibold">{{ totalSavings }}</p>
    </UCard>
  </div>
</template>
