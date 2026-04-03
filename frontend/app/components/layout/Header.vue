<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Clientes',
    to: '/clients',
    icon: 'i-lucide-users',
    active: route.path.startsWith('/clients')
  },
  {
    label: 'Deudas',
    to: '/debts',
    icon: 'i-lucide-hand-coins',
    active: route.path.startsWith('/debts')
  },
  {
    label: 'Mensajes',
    to: '/messages',
    icon: 'i-lucide-message-square',
    active: route.path.startsWith('/messages')
  }
])
</script>

<template>
  <UHeader mode="slideover">
    <template #title>
      <NuxtLink to="/" class="text-sm font-semibold">
        Prueba Técnica Lidz.ai
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
