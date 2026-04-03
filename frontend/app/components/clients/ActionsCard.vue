<script setup lang="ts">
defineProps<{
  saving: boolean
}>()

const emit = defineEmits<{
  details: []
  update: []
  remove: []
}>()
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="font-semibold">Acciones del cliente seleccionado</h3>
    </template>

    <div class="flex flex-wrap gap-2">
      <UButton color="neutral" variant="soft" @click="emit('details')">
        Ver detalle
      </UButton>
      <UButton color="primary" :loading="saving" @click="emit('update')">
        Actualizar seleccionado
      </UButton>
      <UButton color="error" variant="soft" :loading="saving" @click="emit('remove')">
        Eliminar seleccionado
      </UButton>
    </div>
  </UCard>
</template>
