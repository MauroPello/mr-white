<script setup lang="ts">
withDefaults(defineProps<{ error?: object }>(), {
  error: () => ({} as object),
});

const toast = useToast();

onMounted(() => {
  toast.add({
    title: "Qualcosa è andato storto",
    description: "Sei stato reindirizzato alla pagina principale.",
    icon: "i-heroicons-exclamation-triangle",
    color: "red",
  });

  navigateTo("/");
});
</script>

<template>
  <div>
    <LandingPageNavigator />
    <VueError class="mt-20" :error="error" />
  </div>
</template>
