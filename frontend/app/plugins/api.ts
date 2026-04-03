export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: String(config.public.apiBaseUrl || 'http://localhost:3000'),
    timeout: 10000
  })

  return {
    provide: {
      api
    }
  }
})
