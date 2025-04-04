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
