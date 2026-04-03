<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { h, resolveComponent } from 'vue';
import type { ClientDTO } from '~/dtos';
import { useClientsService } from '~/services/clients';
import { formatNumber, formatRut } from '~/utils';

const service = useClientsService();

const loadingTable = ref(false);
const clients = ref<ClientDTO[]>([]);
const errorMessage = ref('');

function getSurnameInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 1) {
    return (parts[0] ?? '').slice(0, 2).toUpperCase();
  }

  const surnameInitials = parts
    .slice(1)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return surnameInitials.slice(0, 2);
}

function headerWithIcon(iconClass: string, label: string) {
  const UIcon = resolveComponent('UIcon');

  return () =>
    h('div', { class: 'flex items-center gap-2' }, [
      h(UIcon, { name: iconClass, class: 'text-base text-primary' }),
      h('span', { class: 'font-medium' }, label),
    ]);
}

const tableColumns: TableColumn<ClientDTO>[] = [
  {
    accessorKey: 'name',
    header: headerWithIcon('i-lucide-user-round', 'Nombre'),
    cell: ({ row }: { row: { original: ClientDTO } }) => {
      const initials = getSurnameInitials(row.original.name);

      return h('div', { class: 'flex items-center gap-3' }, [
        h(
          'span',
          {
            class:
              'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-xs',
          },
          initials || '--'
        ),
        h('span', { class: 'font-medium' }, row.original.name),
      ]);
    },
  },
  {
    accessorKey: 'rut',
    header: headerWithIcon('i-lucide-id-card', 'RUT'),
    cell: ({ row }: { row: { original: ClientDTO } }) => formatRut(row.original.rut),
  },
  {
    accessorKey: 'salary',
    header: headerWithIcon('i-lucide-wallet', 'Sueldo'),
    cell: ({ row }: { row: { original: ClientDTO } }) => formatNumber(row.original.salary),
  },
  {
    accessorKey: 'savings',
    header: headerWithIcon('i-lucide-piggy-bank', 'Ahorros'),
    cell: ({ row }: { row: { original: ClientDTO } }) => formatNumber(row.original.savings),
  },
];

const totalSalary = computed(() => clients.value.reduce((acc, item) => acc + item.salary, 0));
const totalSavings = computed(() => clients.value.reduce((acc, item) => acc + item.savings, 0));

function setError(message: string) {
  errorMessage.value = message;
}

async function loadClients() {
  try {
    loadingTable.value = true;
    clients.value = await service.list();
  } catch {
    setError('No se pudo cargar la lista de clientes.');
  } finally {
    loadingTable.value = false;
  }
}

async function onRowSelect(_event: Event, row: { original: ClientDTO }) {
  const clientId = row?.original?.id;

  if (!clientId) {
    setError('No se pudo obtener el ID del cliente seleccionado.');
    return;
  }

  await navigateTo(`/clients/${encodeURIComponent(clientId)}`);
}

onMounted(loadClients);
</script>

<template>
  <UContainer class="py-8 space-y-6">
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-xl font-semibold tracking-tight">Clientes</h1>
      <UButton
        icon="i-lucide-user-plus"
        @click="navigateTo('/clients/new')"
      >
        Iniciar conversación
      </UButton>
    </div>

    <ClientsStats
      :total-clients="clients.length"
      :total-salary="totalSalary"
      :total-savings="totalSavings"
    />

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      :title="errorMessage"
    />

    <ClientsTableCard
      :clients="clients"
      :columns="tableColumns"
      :loading="loadingTable"
      @reload="loadClients"
      @row-select="onRowSelect"
    />
  </UContainer>
</template>
