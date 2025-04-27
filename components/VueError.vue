<script setup lang="ts">
const props = defineProps<{ error: unknown }>();
const { error } = toRefs(props);

const isPageNotFound = computed(
  () =>
    error.value instanceof Object &&
    "message" in error.value &&
    String(error.value.message).includes("Page not found")
);

const router = useRouter();
</script>

<template>
  <div class="error-page">
    <h1 class="error-page__title">Errore fatale!</h1>
    <p class="w-[90%] text-lg bg-slate-200 rounded-lg p-4">
      {{ isPageNotFound ? "Pagina non trovata" : error }}
    </p>
    <div class="flex flex-row gap-4">
      <UButton size="xl" class="text-lg" @click="router.go(0)">
        Ricarica la pagina
      </UButton>
      <UButton
        size="xl"
        class="text-lg"
        @click="
          async () => {
            await router.push('/');
            router.go(0);
          }
        "
      >
        Torna alla home
      </UButton>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.error-page {
  @apply w-full py-10 gap-7 flex flex-col items-center justify-center;

  &__title {
    @apply text-3xl font-medium;
  }
}
</style>
