<script setup lang="ts">
import type {
    CreateClientDebtRequestDTO,
    CreateClientMessageRequestDTO,
    CreateClientRequestDTO
} from '~/dtos';
import { formatRut } from '~/utils';

const form = defineModel<CreateClientRequestDTO>('form', { required: true })
const open = defineModel<boolean>('open', { required: true })

defineProps<{
  saving: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

function splitName(fullName: string): { firstName: string, lastName: string } {
  const normalized = fullName.trim()

  if (!normalized) {
    return { firstName: '', lastName: '' }
  }

  const parts = normalized.split(/\s+/)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' ')
  }
}

function composeName(firstName: string, lastName: string): string {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
}

const firstName = computed({
  get: () => splitName(form.value.name).firstName,
  set: (value: string) => {
    const lastName = splitName(form.value.name).lastName
    form.value.name = composeName(value, lastName)
  }
})

const lastName = computed({
  get: () => splitName(form.value.name).lastName,
  set: (value: string) => {
    const firstName = splitName(form.value.name).firstName
    form.value.name = composeName(firstName, value)
  }
})

function onRutBlur() {
  form.value.rut = formatRut(form.value.rut)
}

function addDebt() {
  if (!form.value.debts) {
    form.value.debts = []
  }

  form.value.debts.push({
    institution: '',
    amount: 0,
    dueDate: ''
  })
}

function removeDebt(index: number) {
  if (!form.value.debts) {
    return
  }

  form.value.debts.splice(index, 1)
}

function addMessage() {
  if (!form.value.messages) {
    form.value.messages = []
  }

  form.value.messages.push({
    text: '',
    role: 'client',
    sentAt: ''
  })
}

function removeMessage(index: number) {
  if (!form.value.messages) {
    return
  }

  form.value.messages.splice(index, 1)
}

const messageRoleItems: Array<{ label: string, value: CreateClientMessageRequestDTO['role'] }> = [
  { label: 'Cliente', value: 'client' },
  { label: 'Agente', value: 'agent' }
]

const debts = computed<CreateClientDebtRequestDTO[]>(() => form.value.debts ?? [])
const messages = computed<CreateClientMessageRequestDTO[]>(() => form.value.messages ?? [])
</script>

<template>
  <UModal
    v-model:open="open"
    title="Nuevo cliente"
    description="Crea el cliente y opcionalmente agrega deudas y mensajes iniciales."
    :ui="{ content: 'max-w-5xl rounded-3xl dark:bg-neutral-900' }"
  >
    <template #body>
      <UForm :state="form" class="space-y-7" @submit="emit('submit')">
        <div class="rounded-3xl bg-sky-50 dark:bg-neutral-800 p-4 md:p-5 space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-user-round-plus" class="text-sky-700 dark:text-sky-300" />
            <p class="text-sm font-semibold text-sky-800 dark:text-sky-200">Datos del contribuyente</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <UFormField class="w-full" label="Nombre">
              <UInput v-model="firstName" class="w-full" placeholder="Juan" />
            </UFormField>

            <UFormField class="w-full" label="Apellido">
              <UInput v-model="lastName" class="w-full" placeholder="Perez" />
            </UFormField>

            <UFormField class="w-full" label="RUT">
              <UInput v-model="form.rut" class="w-full" placeholder="12345678-9" @blur="onRutBlur" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UFormField class="w-full" label="Sueldo">
              <UInputNumber v-model="form.salary" class="w-full" :min="0" />
            </UFormField>

            <UFormField class="w-full" label="Ahorros">
              <UInputNumber v-model="form.savings" class="w-full" :min="0" />
            </UFormField>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="rounded-3xl bg-white dark:bg-neutral-900 p-4 md:p-5 space-y-3 ring-1 ring-slate-100 dark:ring-neutral-800">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-receipt-text" class="text-slate-700 dark:text-neutral-200" />
                <h4 class="font-semibold">Deudas</h4>
                <UBadge color="neutral" variant="subtle">{{ debts.length }}</UBadge>
              </div>
              <UButton type="button" color="neutral" variant="soft" icon="i-lucide-plus" @click="addDebt">
                Agregar
              </UButton>
            </div>

            <div v-if="!debts.length" class="rounded-2xl bg-slate-50 dark:bg-neutral-800 p-4 text-sm text-muted">
              Sin deudas agregadas.
            </div>

            <div class="space-y-3">
              <div
                v-for="(debt, index) in debts"
                :key="`debt-${index}`"
                class="rounded-2xl bg-slate-50 dark:bg-neutral-800 p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
              >
                <UFormField class="md:col-span-5" :label="`Institucion ${index + 1}`">
                  <UInput v-model="debt.institution" placeholder="Banco Estado" />
                </UFormField>

                <UFormField class="md:col-span-3" label="Monto">
                  <UInputNumber v-model="debt.amount" :min="0" />
                </UFormField>

                <UFormField class="md:col-span-3" label="Vencimiento">
                  <UInput v-model="debt.dueDate" type="date" />
                </UFormField>

                <UButton
                  type="button"
                  class="md:col-span-1"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  @click="removeDebt(index)"
                />
              </div>
            </div>
          </div>

          <div class="rounded-3xl bg-white dark:bg-neutral-900 p-4 md:p-5 space-y-3 ring-1 ring-slate-100 dark:ring-neutral-800">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-messages-square" class="text-slate-700 dark:text-neutral-200" />
                <h4 class="font-semibold">Mensajes</h4>
                <UBadge color="neutral" variant="subtle">{{ messages.length }}</UBadge>
              </div>
              <UButton type="button" color="neutral" variant="soft" icon="i-lucide-plus" @click="addMessage">
                Agregar
              </UButton>
            </div>

            <div v-if="!messages.length" class="rounded-2xl bg-slate-50 dark:bg-neutral-800 p-4 text-sm text-muted">
              Sin mensajes agregados.
            </div>

            <div class="space-y-3">
              <div
                v-for="(message, index) in messages"
                :key="`message-${index}`"
                class="rounded-2xl bg-slate-50 dark:bg-neutral-800 p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
              >
                <UFormField class="md:col-span-2" :label="`Rol ${index + 1}`">
                  <USelect
                    v-model="message.role"
                    :items="messageRoleItems"
                    value-key="value"
                    label-key="label"
                  />
                </UFormField>

                <UFormField class="md:col-span-5" label="Texto">
                  <UInput v-model="message.text" placeholder="Mensaje..." />
                </UFormField>

                <UFormField class="md:col-span-4" label="Fecha y hora">
                  <UInput v-model="message.sentAt" type="datetime-local" />
                </UFormField>

                <UButton
                  type="button"
                  class="md:col-span-1"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  @click="removeMessage(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="w-full flex items-center justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="open = false">
          Cancelar
        </UButton>
        <UButton :loading="saving" icon="i-lucide-check" @click="emit('submit')">
          Guardar cliente
        </UButton>
      </div>
    </template>
  </UModal>
</template>
