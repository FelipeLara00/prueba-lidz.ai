<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Prueba Técnica Lidz.ai'
const description = 'Prueba Técnica Lidz.ai'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/favicon.ico',
  twitterImage: '/favicon.ico',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp class="min-h-screen bg-sky-50 dark:bg-neutral-950">
    <LayoutHeader />
    <UMain class="bg-sky-50 dark:bg-neutral-950">
      <NuxtPage />
    </UMain>
  </UApp>
</template>
