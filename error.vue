<script setup lang="ts">
withDefaults(defineProps<{ error?: object }>(), {
  error: () => ({}) as object,
});
</script>

<template>
  <div>
    <VueError :error="error" />
  </div>
</template>
