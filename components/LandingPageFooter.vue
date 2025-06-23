<script setup lang="ts">
import { companyName } from "~/constants/company";
</script>

<template>
  <div class="landing-page-footer">
    <NuxtLink class="landing-page-footer__logo__link" to="/">
      <BaseLogo />
      <p>{{ companyName }}</p>
    </NuxtLink>
    <p>
      Fatto con ❤️ da
      <NuxtLink
        to="https://www.linkedin.com/in/mauro-pellonara/"
        class="font-medium hover:underline"
        target="_blank" rel="noopener noreferrer"
      >Mauro Pellonara</NuxtLink>
    </p>
    <p>© {{ new Date().getFullYear() }} {{ companyName }}</p>
  </div>
</template>

<style lang="postcss" scoped>
.landing-page-footer {
  @apply flex flex-col items-center justify-center gap-3 bg-primary-300 px-4 py-8;

  &__logo__link {
    @apply flex items-center gap-3 pb-2;
    @apply text-2xl font-semibold;
  }
}
</style>
