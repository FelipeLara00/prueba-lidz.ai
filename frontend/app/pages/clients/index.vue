<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
import type {
  ClientDTO,
  CreateClientDebtRequestDTO,
  CreateClientMessageRequestDTO,
  CreateClientRequestDTO
} from '~/dtos'
import { useClientsService } from '~/services/clients'
import { formatNumber, formatRut } from '~/utils'

const service = useClientsService()

const loadingTable = ref(false)
const saving = ref(false)
const createModalOpen = ref(false)
const clients = ref<ClientDTO[]>([])
const errorMessage = ref('')
const successMessage = ref('')

const createForm = reactive<CreateClientRequestDTO>({
  name: '',
  rut: '',
  salary: 0,
  savings: 0,
  debts: [],
  messages: []
})

function getSurnameInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)

  if (parts.length <= 1) {
    return (parts[0] ?? '').slice(0, 2).toUpperCase()
  }

  const surnameInitials = parts
    .slice(1)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  return surnameInitials.slice(0, 2)
}

function headerWithIcon(iconClass: string, label: string) {
  const UIcon = resolveComponent('UIcon')

  return () =>
    h('div', { class: 'flex items-center gap-2' }, [
      h(UIcon, { name: iconClass, class: 'text-base text-primary' }),
      h('span', { class: 'font-medium' }, label)
    ])
}

const tableColumns: TableColumn<ClientDTO>[] = [
  {
    accessorKey: 'name',
    header: headerWithIcon('i-lucide-user-round', 'Nombre'),
    cell: ({ row }: { row: { original: ClientDTO } }) => {
      const UIcon = resolveComponent('UIcon')
      const initials = getSurnameInitials(row.original.name)

      return h('div', { class: 'flex items-center gap-3' }, [
        h(
          'span',
          {
            class: 'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-xs'
          },
          initials || '--'
        ),
        h('div', { class: 'flex items-center gap-2' }, [
          h('span', { class: 'font-medium' }, row.original.name)
        ])
      ])
    }
  },
  {
    accessorKey: 'rut',
    header: headerWithIcon('i-lucide-id-card', 'RUT'),
    cell: ({ row }: { row: { original: ClientDTO } }) => formatRut(row.original.rut)
  },
  {
    accessorKey: 'salary',
    header: headerWithIcon('i-lucide-wallet', 'Sueldo'),
    cell: ({ row }: { row: { original: ClientDTO } }) => formatNumber(row.original.salary)
  },
  {
    accessorKey: 'savings',
    header: headerWithIcon('i-lucide-piggy-bank', 'Ahorros'),
    cell: ({ row }: { row: { original: ClientDTO } }) => formatNumber(row.original.savings)
  }
]

const totalSalary = computed(() => clients.value.reduce((acc, item) => acc + item.salary, 0))
const totalSavings = computed(() => clients.value.reduce((acc, item) => acc + item.savings, 0))

function setSuccess(message: string) {
  successMessage.value = message
  errorMessage.value = ''
}

function setError(message: string) {
  errorMessage.value = message
  successMessage.value = ''
}

function toIsoOrEmpty(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString()
}

async function loadClients() {
  try {
    loadingTable.value = true
    clients.value = await service.list()
  } catch {
    setError('No se pudo cargar la lista de clientes.')
  } finally {
    loadingTable.value = false
  }
}

async function handleCreate() {
  try {
    saving.value = true
    const created = await service.create({
      name: createForm.name.trim(),
      rut: createForm.rut.trim(),
      salary: Number(createForm.salary),
      savings: Number(createForm.savings),
      debts: (createForm.debts ?? [])
        .map((item): CreateClientDebtRequestDTO => ({
          institution: item.institution.trim(),
          amount: Number(item.amount),
          dueDate: item.dueDate ? toIsoOrEmpty(item.dueDate) : ''
        }))
        .filter((item) => item.institution && item.amount > 0 && item.dueDate),
      messages: (createForm.messages ?? [])
        .map((item): CreateClientMessageRequestDTO => ({
          text: item.text.trim(),
          role: item.role,
          sentAt: item.sentAt ? toIsoOrEmpty(item.sentAt) : ''
        }))
        .filter((item) => item.text && item.sentAt)
    })
    setSuccess(`Cliente ${created.name} creado correctamente.`)
    createModalOpen.value = false
    createForm.name = ''
    createForm.rut = ''
    createForm.salary = 0
    createForm.savings = 0
    createForm.debts = []
    createForm.messages = []
    await loadClients()
  } catch {
    setError('No se pudo crear el cliente.')
  } finally {
    saving.value = false
  }
}

async function onRowSelect(_event: Event, row: { original: ClientDTO }) {
  const clientId = row?.original?.id

  if (!clientId) {
    setError('No se pudo obtener el ID del cliente seleccionado.')
    return
  }

  await navigateTo(`/clients/${encodeURIComponent(clientId)}`)
}

onMounted(loadClients)
</script>

<template>
  <UContainer class="py-8 space-y-6">
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-xl font-semibold tracking-tight">Clientes</h1>
      <UButton icon="i-lucide-user-plus" @click="createModalOpen = true">
        Nuevo cliente
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

    <UAlert
      v-if="successMessage"
      color="success"
      variant="subtle"
      :title="successMessage"
    />

    <ClientsCreateCard
      v-model:open="createModalOpen"
      v-model:form="createForm"
      :saving="saving"
      @submit="handleCreate"
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
