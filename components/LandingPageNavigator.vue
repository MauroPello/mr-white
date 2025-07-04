<script setup lang="ts">
import { companyName } from "~/constants/company";

const { isMobile } = useScreenSize();

const router = useRouter();

const play = async () => {
  const originPath = router.currentRoute.value.path;
  await router.push("/#gioca");
  if (originPath !== "/") {
    router.go(0);
  }
};
</script>

<template>
  <div class="landing-page-navigator__container">
    <div
      class="flex flex-row items-center justify-center text-white bg-primary-500 w-full py-0.5 cursor-pointer text-center"
    >
      <div class="overflow-hidden w-full">
        <div class="marquee-wrapper">
          <template
            v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8]"
            :key="i"
          >
            <span
              v-if="i % 3 === 0"
              class="inline-block pl-4 pr-40 md:pr-80"
              @click="navigateTo('/#gioca')"
            >
              {{ companyName }} è gratuito! Gioca ora! 🚀
            </span>
            <span
              v-else-if="i % 3 === 1"
              class="inline-block pl-4 pr-40 md:pr-80"
            >
              200+ nuove parole aggiunte! 🎲
            </span>
            <span
              v-else
              class="inline-block pl-4 pr-40 md:pr-80"
              @click="navigateTo('/#supporta')"
            >
              Supporta {{ companyName }} donando un caffè! ☕️
            </span>
          </template>
        </div>
      </div>
    </div>
    <div class="landing-page-navigator">
      <div class="landing-page-navigator__group">
        <NuxtLink class="landing-page-navigator__logo__link" to="/">
          <BaseLogo :small="true" />
          <p class="hidden sm:block">{{ companyName }}</p>
          <p class="block sm:hidden">Mr. White</p>
        </NuxtLink>
        <UButton
          size="sm"
          class="text-base sm:text-lg text-gray-700 hover:text-black hidden md:block"
          variant="ghost"
          to="/consigli"
        >
          Consigli
        </UButton>
      </div>
      <div class="landing-page-navigator__group">
        <UButton
          label="Gioca"
          :size="isMobile ? 'md' : 'xl'"
          class="text-base sm:text-lg"
          @click="play"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.landing-page-navigator {
  @apply flex items-center justify-between h-16 md:h-20 bg-primary-100 px-4 sm:px-6;

  &__container {
    @apply fixed top-0 left-0 right-0 z-50;
  }

  &__group {
    @apply flex items-center gap-1 sm:gap-4 lg:gap-6 xl:gap-8;
  }

  &__link {
    @apply text-xl font-medium text-slate-500;
  }

  &__link:hover {
    @apply text-slate-700;
  }

  &__logo__link {
    @apply flex items-center gap-3;
    @apply text-2xl font-semibold;
  }
}

.marquee-text {
  display: inline-block;
  padding-left: 1rem;
  padding-right: 10rem;
}

.marquee-wrapper {
  display: inline-flex;
  white-space: nowrap;
  animation: marquee 25s linear infinite;
  animation-delay: 0.5s;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
