<script setup lang="ts">
// import { Analytics } from "@vercel/analytics/nuxt";
import { companyLogo, companyUrl } from "~/constants/company";

const router = useRouter();

const fullPath = computed(
  () => companyUrl + router.currentRoute.value.fullPath
);

useHead({
  script: [
    {
      src: "https://analytics.ahrefs.com/analytics.js",
      async: true,
      'data-key': "8FjwW8v3+ZZpWnrjaNP5Gg"
    },
    {
      src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4157139235391603",
      async: true,
      crossorigin: "anonymous"
    }
  ]
});
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
    <!-- <Analytics /> -->
  </div>
</template>

<style lang="postcss">
.landing-page-base {
  @apply w-full h-screen flex flex-col;

  &__main {
    @apply w-full pt-16 md:pt-20 flex-1;
    @apply bg-gradient-to-br from-brandy-50 via-brandy-100 to-brandy-200 dark:from-woodsmoke-900 dark:via-woodsmoke-950 dark:to-black;
  }
}
</style>
