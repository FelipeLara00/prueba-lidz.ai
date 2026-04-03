<script setup lang="ts">
import type { CreateClientRequestDTO } from '~/dtos'

const form = defineModel<CreateClientRequestDTO>('form', { required: true })

defineProps<{
  saving: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="font-semibold">Crear cliente</h3>
    </template>

    <UForm :state="form" class="space-y-4" @submit="emit('submit')">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <UFormField label="Nombre">
          <UInput v-model="form.name" placeholder="Juan Perez" />
        </UFormField>

        <UFormField label="RUT">
          <UInput v-model="form.rut" placeholder="12345678-9" />
        </UFormField>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <UFormField label="Sueldo">
          <UInputNumber v-model="form.salary" :min="0" />
        </UFormField>

        <UFormField label="Ahorros">
          <UInputNumber v-model="form.savings" :min="0" />
        </UFormField>
      </div>

      <UButton type="submit" :loading="saving" block>
        Crear cliente
      </UButton>
    </UForm>
  </UCard>
</template>
