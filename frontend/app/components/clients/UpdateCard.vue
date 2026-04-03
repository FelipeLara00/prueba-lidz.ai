<script setup lang="ts">
import type { UpdateClientRequestDTO } from '~/dtos'

const form = defineModel<UpdateClientRequestDTO>('form', { required: true })

defineProps<{
  visible: boolean
  saving: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <UCard v-if="visible">
    <template #header>
      <h3 class="font-semibold">Editar cliente seleccionado</h3>
    </template>

    <form class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="emit('submit')">
      <UFormField label="Nombre">
        <UInput v-model="form.name" />
      </UFormField>

      <UFormField label="RUT">
        <UInput v-model="form.rut" />
      </UFormField>

      <UFormField label="Sueldo">
        <UInputNumber v-model="form.salary" :min="0" />
      </UFormField>

      <UFormField label="Ahorros">
        <UInputNumber v-model="form.savings" :min="0" />
      </UFormField>

      <div class="md:col-span-2">
        <UButton type="submit" :loading="saving">
          Guardar cambios
        </UButton>
      </div>
    </form>
  </UCard>
</template>
