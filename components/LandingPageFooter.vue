<script setup lang="ts">
import {companyName} from "~/constants/company";
</script>

<template>
  <div class="landing-page-footer">
    <NuxtLink
      class="landing-page-footer__logo__link"
      to="/"
    >
      <BaseLogo />
      <p>{{ companyName }}</p>
    </NuxtLink>
    <p>© {{ new Date().getFullYear() }} {{ companyName }}</p>
  </div>
</template>

<style lang="postcss" scoped>
.landing-page-footer {
  @apply flex flex-col items-center justify-center gap-2 bg-primary-300 px-4 py-8;
}
</style>
