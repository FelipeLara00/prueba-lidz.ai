<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Clientes',
    to: '/clients',
    icon: 'i-lucide-users',
    active: route.path.startsWith('/clients')
  }
])
</script>

<template>
  <ClientOnly>
    <UHeader mode="slideover">
      <template #title>
        <NuxtLink to="/clients" class="text-sm font-semibold">
          Prueba Técnica Lidz.ai
        </NuxtLink>
      </template>

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
  </ClientOnly>
</template>
