<script setup lang="ts">
import type {
  ClientDTO,
  CreateClientRequestDTO
} from '~/dtos'
import { useClientsService } from '~/services/clients'

const service = useClientsService()

const loadingTable = ref(false)
const saving = ref(false)
const clients = ref<ClientDTO[]>([])
const errorMessage = ref('')
const successMessage = ref('')

const createForm = reactive<CreateClientRequestDTO>({
  name: '',
  rut: '',
  salary: 0,
  savings: 0
})

const tableColumns = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'rut', header: 'RUT' },
  { accessorKey: 'salary', header: 'Sueldo' },
  { accessorKey: 'savings', header: 'Ahorros' }
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
    const created = await service.create({ ...createForm })
    setSuccess(`Cliente ${created.name} creado correctamente.`)
    createForm.name = ''
    createForm.rut = ''
    createForm.salary = 0
    createForm.savings = 0
    await loadClients()
  } catch {
    setError('No se pudo crear el cliente.')
  } finally {
    saving.value = false
  }
}

onMounted(loadClients)
</script>

<template>
  <UContainer class="py-8 space-y-6">
    <UPageHeader
      title="Clientes"
      description="Gestion de clientes conectada al backend."
    />

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
      v-model:form="createForm"
      :saving="saving"
      @submit="handleCreate"
    />

    <ClientsTableCard
      :clients="clients"
      :columns="tableColumns"
      :loading="loadingTable"
      @reload="loadClients"
    />
  </UContainer>
</template>
