<script setup lang="ts">
import { companyName } from "~/constants/company";
</script>

<template>
  <footer
    class="bg-brandy-100/50 dark:bg-woodsmoke-900/50 border-t border-brandy-200 dark:border-woodsmoke-700"
  >
    <div
      class="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-1.5 sm:px-6"
    >
      <div class="flex items-center md:gap-x-2">
        <UButton to="/regole" variant="link" color="gray"
          >Regole del Gioco</UButton
        >
        <UButton to="/consigli" variant="link" color="gray"
          >Consigli e Strategie</UButton
        >
        <UButton to="/privacy" variant="link" color="gray"
          >Privacy</UButton
        >
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center px-2 sm:px-0">
        &copy; {{ new Date().getFullYear() }} {{ companyName }}. Tutti i
        diritti riservati.
      </p>
    </div>
  </footer>
</template>
