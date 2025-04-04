<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <div>
    <slot />
    <SpeedInsights/>
    <Analytics/>
  </div>
</template>

<style lang="postcss" scoped>
</style>
