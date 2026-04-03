<script setup lang="ts">
import type { ClientDetailDTO } from '~/dtos'

defineProps<{
  client: ClientDetailDTO
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <UCard>
      <template #header>
        <p class="text-sm text-muted">Nombre</p>
      </template>
      <p class="font-semibold">{{ client.name }}</p>
    </UCard>
    <UCard>
      <template #header>
        <p class="text-sm text-muted">RUT</p>
      </template>
      <p class="font-semibold">{{ client.rut }}</p>
    </UCard>
    <UCard>
      <template #header>
        <p class="text-sm text-muted">Sueldo</p>
      </template>
      <p class="font-semibold">{{ client.salary }}</p>
    </UCard>
    <UCard>
      <template #header>
        <p class="text-sm text-muted">Ahorros</p>
      </template>
      <p class="font-semibold">{{ client.savings }}</p>
    </UCard>
  </div>
</template>
