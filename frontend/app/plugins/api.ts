export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: String(config.public.apiBaseUrl || '')
  })

  return {
    provide: {
      api
    }
  }
})
