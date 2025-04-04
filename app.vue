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

<style>
/* Optional: Add some basic global styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #e9ecef; /* Light grey background for the whole page */
  color: #212529;
}
</style>