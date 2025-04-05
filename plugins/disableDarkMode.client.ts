export default defineNuxtPlugin((nuxtApp) => {
  const colorMode = useColorMode()
  nuxtApp.hook('app:mounted', () => {
    // Force the color mode to light
    colorMode.preference = 'light'
    colorMode.value = 'light'
  })
})