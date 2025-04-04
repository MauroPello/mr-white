<script lang="ts" setup>
import { companyLogo } from "~/constants/company";

defineProps<{ small?: boolean }>();

useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: companyLogo,
    },
  ],
});
</script>

<template>
  <NuxtImg
    src="logo.png"
    alt="Logo"
    class="size-12 md:size-14 object-contain"
    :class="{'size-10 md:size-12': small}"
  />
</template>
