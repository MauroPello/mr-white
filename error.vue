<script setup lang="ts">
withDefaults(defineProps<{ error?: object }>(), {
  error: () => ({} as object),
});
</script>

<template>
  <div>
    <LandingPageNavigator />
    <VueError class="mt-20" :error="error" />
  </div>
</template>
