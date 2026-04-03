<script setup lang="ts">
import type { ClientMessageDTO } from '~/dtos';
import { formatDateTime } from '~/utils';

const props = defineProps<{
  messages: ClientMessageDTO[]
  sending?: boolean
}>()

const emit = defineEmits<{
  submitMessage: [payload: { text: string }]
}>()

const draftText = ref('')
const messagesViewportRef = ref<HTMLElement | null>(null)

function onSubmitMessage() {
  const text = draftText.value.trim()

  if (!text) {
    return
  }

  emit('submitMessage', { text })
  draftText.value = ''
}

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

function scrollMessagesToBottom(behavior: ScrollBehavior = 'auto') {
  const el = messagesViewportRef.value

  if (!el) {
    return
  }

  el.scrollTo({
    top: el.scrollHeight,
    behavior
  })
}

watch(
  () => chatMessages.value.length,
  async (_newLength, oldLength) => {
    await nextTick()
    scrollMessagesToBottom(oldLength === undefined ? 'auto' : 'smooth')
  },
  { immediate: true }
)
</script>

<template>
  <UCard
    class="h-full bg-white dark:bg-neutral-900 rounded-2xl border-0 ring-0 shadow-none p-2"
    :ui="{ root: 'h-full flex flex-col', body: 'flex-1 min-h-0 flex' }"
  >
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-messages-square" class="text-neutral-700 dark:text-neutral-200" />
          <h3 class="font-semibold text-neutral-800 dark:text-neutral-100">Conversacion</h3>
        </div>
        <UBadge color="neutral" variant="subtle">
          {{ chatMessages.length }} mensajes
        </UBadge>
      </div>
    </template>

    <div class="rounded-2xl bg-white dark:bg-neutral-900 p-1 h-full w-full min-h-0 flex flex-col">
      <div ref="messagesViewportRef" class="flex-1 min-h-0 overflow-y-auto pr-1 pb-3">
        <UChatMessages
          :messages="chatMessages"
          :should-scroll-to-bottom="true"
          :user="{ side: 'right', variant: 'solid' }"
          :assistant="{ side: 'left', variant: 'soft' }"
        >
          <template #content="{ message }">
            <div class="space-y-1">
              <p class="whitespace-pre-wrap">{{ message.parts?.[0]?.text }}</p>
              <p class="text-xs text-muted">
                {{ message.metadata?.sourceRole === 'client' ? 'Cliente' : 'Agente' }} •
                {{ formatDateTime(String(message.metadata?.sentAt || '')) }}
              </p>
            </div>
          </template>
        </UChatMessages>
      </div>

      <div class="mt-2 pt-3 bg-white dark:bg-neutral-900 backdrop-blur-sm rounded-xl">
        <UChatPrompt
          v-model="draftText"
          :rows="1"
          :maxrows="4"
          :disabled="sending"
          placeholder="Escribe un mensaje..."
          @submit="onSubmitMessage"
        >
          <template #footer>
            <div class="w-full flex items-center justify-end">
              <UChatPromptSubmit
                :status="sending ? 'streaming' : 'ready'"
                :disabled="!draftText.trim()"
                color="primary"
                variant="solid"
              />
            </div>
          </template>
        </UChatPrompt>
      </div>
    </div>
  </UCard>
</template>
