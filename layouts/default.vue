<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <div class="landing-page-base">
    <LandingPageNavigator />
    <div class="landing-page-base__main">
      <slot />
    </div>
    <LandingPageFooter />
    <SpeedInsights/>
    <Analytics/>
  </div>
</template>

<style lang="postcss">
.landing-page-base {
  @apply w-full h-screen flex flex-col;

  &__main {
    @apply w-full pt-20 flex-1;
  }
}
</style>
