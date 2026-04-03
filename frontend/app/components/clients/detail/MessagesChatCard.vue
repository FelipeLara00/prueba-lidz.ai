<script setup lang="ts">
import type { ClientMessageDTO } from '~/dtos'

const props = defineProps<{
  messages: ClientMessageDTO[]
}>()

const chatMessages = computed(() => {
  return [...props.messages]
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
    .map((message) => ({
      id: message.id,
      role: message.role === 'client' ? 'user' : 'assistant',
      parts: [
        {
          type: 'text',
          text: message.text
        }
      ],
      metadata: {
        sentAt: message.sentAt,
        sourceRole: message.role
      }
    }))
})
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="font-semibold">Mensajes</h3>
    </template>
    <UChatMessages
      :messages="chatMessages"
      :should-scroll-to-bottom="false"
      :user="{ side: 'right', variant: 'soft' }"
      :assistant="{ side: 'left', variant: 'outline' }"
    >
      <template #content="{ message }">
        <div class="space-y-1">
          <p class="whitespace-pre-wrap">{{ message.parts?.[0]?.text }}</p>
          <p class="text-xs text-muted">
            {{ message.metadata?.sourceRole === 'client' ? 'Cliente' : 'Agente' }} •
            {{ new Date(message.metadata?.sentAt).toLocaleString() }}
          </p>
        </div>
      </template>
    </UChatMessages>
  </UCard>
</template>
