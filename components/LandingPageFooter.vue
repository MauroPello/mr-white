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
    <div class="landing-page-footer__links text-center text-sm">
      <p>
      Disponibile a:
      <NuxtLink to="https://www.undercovergioco.it" target="_blank" rel="noopener noreferrer" class="hover:underline break-all">undercovergioco.it</NuxtLink>,
      <NuxtLink to="https://www.mrwhitegioco.it" target="_blank" rel="noopener noreferrer" class="hover:underline ml-1 break-all">mrwhitegioco.it</NuxtLink>,
      <NuxtLink to="https://www.mrwhite.fun" target="_blank" rel="noopener noreferrer" class="hover:underline ml-1 break-all">mrwhite.fun</NuxtLink>,
      <NuxtLink to="https://www.undercover.website" target="_blank" rel="noopener noreferrer" class="hover:underline ml-1 break-all">undercover.website</NuxtLink>
      </p>
    </div>
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
