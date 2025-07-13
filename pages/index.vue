<script setup lang="ts">
import {
  companyName,
  companyMainStructuredData,
  companyLogo,
} from "~/constants/company";
import { loadGameStateFromLocalStorage } from "~/utils/gameStateStorage";

useHead(companyMainStructuredData);

const { isMobile } = useScreenSize();
const route = useRoute();

const scrollToHash = async (hash: string) => {
  if (!hash) return;

  await nextTick();
  // Using a timeout to ensure the DOM is fully updated.
  setTimeout(() => {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, 100);
};

onMounted(() => {
  const hash = loadGameStateFromLocalStorage() ? "#gioca" : route.hash;

  if (hash !== route.hash) {
    navigateTo(hash, { replace: true });
  }

  scrollToHash(hash);
});

watch(
  () => route.hash,
  (newHash) => {
    scrollToHash(newHash);
  },
  { immediate: false } // Do not run immediately, onMounted handles initial load.
);
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-brandy-50 via-brandy-100 to-brandy-200 dark:from-woodsmoke-900 dark:via-woodsmoke-950 dark:to-black"
  >
    <UContainer class="py-12">
      <div class="text-center mb-16 pt-10">
        <NuxtImg
          :src="companyLogo"
          alt="Mr. White Logo"
          class="mx-auto h-32 w-auto mb-8 animate-float"
        />
        <h1
          class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl mb-6 animate-appear opacity-0 [--appear-delay:100ms]"
          style="animation-fill-mode: forwards"
        >
          {{ companyName }}
        </h1>
        <p
          class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 animate-appear opacity-0 [--appear-delay:300ms]"
          style="animation-fill-mode: forwards"
        >
          {{ `Il gioco di società dove tutti conoscono la parola segreta... tranne gli Undercover e Mr. White! ${isMobile ? '' : 'Scopri chi sono o confondi gli altri in questo divertente gioco da fare insieme con un solo telefono!'}` }}
        </p>
        <p
          class="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300 animate-appear opacity-0 [--appear-delay:400ms]"
          style="animation-fill-mode: forwards"
        >
          Con <strong>600+ parole</strong> completamente gratuite, il
          divertimento è assicurato!
        </p>
        <div
          class="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 animate-appear opacity-0 [--appear-delay:500ms]"
          style="animation-fill-mode: forwards"
        >
          <UButton icon="i-heroicons-play-circle" size="xl" to="/#gioca">
            Inizia a Giocare
          </UButton>
          <UButton
            to="/consigli"
            variant="ghost"
            icon="i-heroicons-book-open"
            size="xl"
            color="gray"
          >
            Leggi i Consigli <span aria-hidden="true">→</span>
          </UButton>
        </div>
      </div>

      <div class="py-16">
        <h2
          class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white text-center mb-3"
        >
          Pronto a Giocare?
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 text-center mb-10">
          Imposta qui sotto la tua partita e inizia subito a scoprire chi sono
          gli Undercover e Mr. White!
        </p>
        <StartGame id="gioca" class="max-w-2xl mx-auto" />
      </div>

      <div class="py-16">
        <h2
          class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white text-center mb-3"
        >
          Come si Gioca?
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 text-center mb-12">
          Bastano pochi semplici passi per iniziare a divertirsi:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div class="flex flex-col items-center text-center p-6">
            <UIcon
              name="i-heroicons-cog-6-tooth"
              class="text-5xl text-primary mb-4"
            />
            <h3
              class="font-semibold text-lg mb-2 text-gray-900 dark:text-white"
            >
              1. Prepara la Partita
            </h3>
            <p class="text-md text-gray-500 dark:text-gray-400">
              Scegli quanti siete e quanti Undercover e Mr. White ci saranno.
            </p>
          </div>
          <div class="flex flex-col items-center text-center p-6">
            <UIcon
              name="i-heroicons-device-phone-mobile"
              class="text-5xl text-primary mb-4"
            />
            <h3
              class="font-semibold text-lg mb-2 text-gray-900 dark:text-white"
            >
              2. Passa il Telefono
            </h3>
            <p class="text-md text-gray-500 dark:text-gray-400">
              Ogni giocatore guarda in segreto la propria parola senza sapere se
              è un Undercover o Mr. White. Nel caso di Mr. White, non riceverà
              nessuna parola!
            </p>
          </div>
          <div class="flex flex-col items-center text-center p-6">
            <UIcon
              name="i-heroicons-chat-bubble-left-right"
              class="text-5xl text-primary mb-4"
            />
            <h3
              class="font-semibold text-lg mb-2 text-gray-900 dark:text-white"
            >
              3. Dai un Indizio
            </h3>
            <p class="text-md text-gray-500 dark:text-gray-400">
              A turno, ognuno dice una parola legata alla parola segreta per far
              vedere che la conosce.
            </p>
          </div>
          <div class="flex flex-col items-center text-center p-6">
            <UIcon
              name="i-heroicons-check-badge"
              class="text-5xl text-primary mb-4"
            />
            <h3
              class="font-semibold text-lg mb-2 text-gray-900 dark:text-white"
            >
              4. Votate!
            </h3>
            <p class="text-md text-gray-500 dark:text-gray-400">
              Votate chi pensate sia Mr. White o un Undercover. Continuate a
              giocare finché tutti gli Undercover, Mr. White o civili sono
              eliminati.
            </p>
          </div>
          <div class="flex flex-col items-center text-center p-6">
            <UIcon
              name="i-heroicons-puzzle-piece"
              class="text-5xl text-primary mb-4"
            />
            <h3
              class="font-semibold text-lg mb-2 text-gray-900 dark:text-white"
            >
              5. Chi Vince?
            </h3>
            <p class="text-md text-gray-500 dark:text-gray-400">
              Se eliminate tutti gli Undercover e Mr. White, vincono i civili.
              Altrimenti, vincono gli Undercover o Mr. White se riesce ad
              indovinare la parola!
            </p>
          </div>
        </div>
      </div>

      <div class="py-16">
        <div class="text-center mb-12">
          <UIcon
            name="i-heroicons-squares-plus"
            class="text-5xl text-primary mb-4"
          />
          <h2
            class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3"
          >
            Perché Giocare a Mr. White?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            Scopri il gioco perfetto per mettere alla prova la tua abilità nel
            bluffare e capire gli altri.
            <NuxtLink
              to="/consigli"
              class="text-primary font-semibold hover:underline"
              >Leggi i nostri consigli</NuxtLink
            >
            per diventare un maestro!
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            class="flex items-start gap-4 p-6 bg-white/50 dark:bg-woodsmoke-800/30 rounded-xl shadow-lg hover:shadow-primary-500/50 dark:hover:shadow-primary-400/20 transition-shadow duration-300"
          >
            <UIcon
              name="i-heroicons-device-phone-mobile"
              class="text-3xl text-primary mt-1 flex-shrink-0"
            />
            <div>
              <h3
                class="font-semibold text-lg mb-1 text-gray-900 dark:text-white"
              >
                Un Solo Telefono
              </h3>
              <p class="text-md text-gray-500 dark:text-gray-400">
                Non servono app o più dispositivi. Basta un telefono e un
                browser per giocare ovunque.
              </p>
            </div>
          </div>
          <div
            class="flex items-start gap-4 p-6 bg-white/50 dark:bg-woodsmoke-800/30 rounded-xl shadow-lg hover:shadow-primary-500/50 dark:hover:shadow-primary-400/20 transition-shadow duration-300"
          >
            <UIcon
              name="i-heroicons-face-smile"
              class="text-3xl text-primary mt-1 flex-shrink-0"
            />
            <div>
              <h3
                class="font-semibold text-lg mb-1 text-gray-900 dark:text-white"
              >
                Risate Garantite
              </h3>
              <p class="text-md text-gray-500 dark:text-gray-400">
                Perfetto per ridere, rompere il ghiaccio o animare una serata
                tra amici.
              </p>
            </div>
          </div>
          <div
            class="flex items-start gap-4 p-6 bg-white/50 dark:bg-woodsmoke-800/30 rounded-xl shadow-lg hover:shadow-primary-500/50 dark:hover:shadow-primary-400/20 transition-shadow duration-300"
          >
            <UIcon
              name="i-heroicons-bolt"
              class="text-3xl text-primary mt-1 flex-shrink-0"
            />
            <div>
              <h3
                class="font-semibold text-lg mb-1 text-gray-900 dark:text-white"
              >
                Facile e Veloce
              </h3>
              <p class="text-md text-gray-500 dark:text-gray-400">
                Si impara in un minuto, e ogni partita dura solo pochi minuti.
              </p>
            </div>
          </div>
          <div
            class="flex items-start gap-4 p-6 bg-white/50 dark:bg-woodsmoke-800/30 rounded-xl shadow-lg hover:shadow-primary-500/50 dark:hover:shadow-primary-400/20 transition-shadow duration-300"
          >
            <UIcon
              name="i-heroicons-currency-euro"
              class="text-3xl text-primary mt-1 flex-shrink-0"
            />
            <div>
              <h3
                class="font-semibold text-lg mb-1 text-gray-900 dark:text-white"
              >
                Totalmente Gratis
              </h3>
              <p class="text-md text-gray-500 dark:text-gray-400">
                600+ parole completamente gratuite, gioca quanto vuoi e senza limiti.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        id="supporta"
        class="py-16 text-center mt-16 border-t border-brandy-200 dark:border-woodsmoke-700"
      >
        <UIcon name="i-heroicons-gift" class="text-5xl text-primary mb-4" />
        <h2
          class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3"
        >
          Ti piace Mr. White? Offrimi un caffè!
        </h2>
        <p
          class="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          Se ti stai divertendo con {{ companyName }}, puoi darmi una mano a
          mantenere il gioco gratuito offrendomi un caffè. Senza il vostro
          supporto non sarebbe possibile mantenere gratuito per tutti questo gioco!
        </p>
        <UButton
          icon="i-heroicons-banknotes"
          size="xl"
          to="https://www.paypal.com/donate/?hosted_button_id=Q4WCV4C5FS4YE"
          target="_blank"
          rel="noopener noreferrer"
          variant="soft"
          color="primary"
          class="text-xl"
        >
          Supporta con PayPal
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<style lang="postcss" scoped>
[id^="gioca"] {
  scroll-margin-top: 80px; /* Must be the same height as your navbar */
}
</style>
