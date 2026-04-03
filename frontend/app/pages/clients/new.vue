<script setup lang="ts">
import type {
  CreateClientDebtRequestDTO,
  CreateClientMessageRequestDTO,
  CreateClientRequestDTO
} from '~/dtos'
import { useClientsService } from '~/services/clients'

const service = useClientsService()

const saving = ref(false)
const errorMessage = ref('')

const createForm = reactive<CreateClientRequestDTO>({
  name: '',
  rut: '',
  salary: 0,
  savings: 0,
  debts: [],
  messages: []
})

function toIsoOrEmpty(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString()
}

async function handleCreate() {
  try {
    saving.value = true
    errorMessage.value = ''

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

    await navigateTo(`/clients/${encodeURIComponent(created.id)}`)
  } catch {
    errorMessage.value = 'No se pudo iniciar la conversación.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 space-y-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Iniciar conversación</h1>
        <p class="text-sm text-muted">Crea el cliente y envía su primer mensaje.</p>
      </div>

      <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" @click="navigateTo('/clients')">
        Volver
      </UButton>
    </div>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      :title="errorMessage"
    />

    <ClientsCreateCard
      v-model:form="createForm"
      :saving="saving"
      @submit="handleCreate"
    />
  </UContainer>
</template>
