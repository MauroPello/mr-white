<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
import { Analytics } from "@vercel/analytics/nuxt";
import { companyLogo, companyUrl } from "~/constants/company";

const router = useRouter();

const fullPath = computed(
  () => companyUrl + router.currentRoute.value.fullPath
);
</script>

<template>
  <div class="landing-page-base">
    <Link rel="canonical" :href="fullPath" />

    <Link rel="alternate" :href="fullPath" hreflang="x-default" />

    <Link
      v-for="type in ['png', 'x-icon']"
      :key="type"
      rel="icon"
      :href="companyLogo"
      :type="`image/${type}`"
    />

    <Link
      v-for="size in [16, 32, 180]"
      :key="size"
      :rel="size === 180 ? 'apple-touch-icon' : 'icon'"
      :href="companyLogo"
      :sizes="`${size}x${size}`"
    />

    <LandingPageNavigator />
    <div class="landing-page-base__main">
      <slot />
    </div>
    <LandingPageFooter />
    <SpeedInsights />
    <!-- <Analytics /> -->
  </div>
</template>

<style lang="postcss">
.landing-page-base {
  @apply w-full h-screen flex flex-col;

  &__main {
    @apply w-full pt-28 flex-1;
  }
}
</style>
