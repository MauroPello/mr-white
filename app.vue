<template>
  <div>
    <NuxtLoadingIndicator color="rgb(var(--color-primary-600))" />
    <NuxtLayout>
      <NuxtErrorBoundary>
        <NuxtPage />

        <template #error="{ error }">
          <VueError :error="error" />
        </template>
      </NuxtErrorBoundary>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import * as Sentry from "@sentry/nuxt";

if (import.meta.client) {
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes("Failed to fetch")) {
      Sentry.captureException(event.reason);
      console.warn("A fetch request was blocked, likely by an ad-blocker.");
      event.preventDefault();
    }
  });
}
</script>
