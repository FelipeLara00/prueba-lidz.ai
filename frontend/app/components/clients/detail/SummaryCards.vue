<script setup lang="ts">
import type { ClientDetailDTO } from '~/dtos';
import { formatNumber, formatRut } from '~/utils';

const props = defineProps<{
  client: ClientDetailDTO;
}>();

const nameInitials = computed(() => {
  const parts = props.client.name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return '--';
  }

  if (parts.length === 1) {
    return (parts.at(0) ?? '').slice(0, 2).toUpperCase();
  }

  const first = parts[0]?.charAt(0) ?? '';
  const second = parts[1]?.charAt(0) ?? '';

  return `${first}${second}`.toUpperCase();
});
</script>

<template>
  <UCard class="bg-white dark:bg-neutral-900 rounded-2xl !border-0 !ring-0 !shadow-none">
    <div class="flex items-start gap-3">
      <div
        class="h-11 w-11 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-semibold"
      >
        {{ nameInitials }}
      </div>
      <div class="min-w-0">
        <p class="text-xs uppercase tracking-wide text-muted">Cliente</p>
        <p class="font-semibold text-lg truncate">
          {{ client.name }}
        </p>
        <p class="text-sm text-muted">
          {{ formatRut(client.rut) }}
        </p>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 p-3">
        <p class="text-xs text-muted flex items-center gap-1">
          <UIcon
            name="i-lucide-wallet"
            class="text-neutral-600 dark:text-neutral-300"
          />
          Sueldo
        </p>
        <p class="font-semibold text-neutral-800 dark:text-neutral-100 mt-1">
          {{ formatNumber(client.salary) }}
        </p>
      </div>
      <div class="rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 p-3">
        <p class="text-xs text-muted flex items-center gap-1">
          <UIcon
            name="i-lucide-piggy-bank"
            class="text-neutral-600 dark:text-neutral-300"
          />
          Ahorros
        </p>
        <p class="font-semibold text-neutral-800 dark:text-neutral-100 mt-1">
          {{ formatNumber(client.savings) }}
        </p>
      </div>
    </div>
  </UCard>
</template>
