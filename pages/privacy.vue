<script setup lang="ts">
import { companyName, companyMainStructuredData } from "~/constants/company";

useHead({
  ...companyMainStructuredData,
  title: "Privacy Policy - " + companyName,
  meta: [
    {
      name: "description",
      content:
        "Privacy Policy di Mr. White. Scopri come gestiamo i tuoi dati e utilizziamo i cookie per migliorare la tua esperienza e per gli annunci pubblicitari.",
    },
  ],
});
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="prose dark:prose-invert mx-auto">
        <h1>Privacy Policy</h1>
        <p>Ultimo aggiornamento: 24 Luglio 2024</p>

        <h2>Informativa sulla Privacy</h2>
        <p>
          La tua privacy è importante per noi. In questa pagina ti spieghiamo
          quali dati raccogliamo e come li utilizziamo quando visiti il nostro
          sito web undercovergioco.it.
        </p>

        <h2>Cookie e Annunci di Terze Parti</h2>
        <p>
          Questo sito utilizza Google AdSense, un servizio di advertising
          fornito da Google. Per mostrare annunci pertinenti, Google e i suoi
          partner utilizzano i cookie (come il cookie DoubleClick) per tenere
          traccia della tua navigazione sul nostro e su altri siti web.
        </p>
        <p>
          Questi cookie permettono a Google di pubblicare annunci basati sui
          tuoi interessi. Non raccolgono informazioni personali come nome,
          indirizzo email, indirizzo fisico o numero di telefono.
        </p>
        <p>
          Puoi scegliere di disattivare la pubblicità personalizzata visitando
          la pagina
          <a href="https://www.google.com/settings/ads" target="_blank"
            >Impostazioni annunci</a
          >
          di Google. In alternativa, puoi visitare il sito
          <a href="https://www.aboutads.info/choices/" target="_blank"
            >www.aboutads.info/choices/</a
          >
          per disattivare l'uso di cookie da parte di fornitori di terze parti
          per la pubblicità personalizzata.
        </p>

        <h2>Contatti</h2>
        <p>
          Per qualsiasi domanda riguardo a questa privacy policy, puoi
          contattarci tramite i canali indicati sul sito.
        </p>

        <hr >

        <div class="text-center mt-12">
          <p class="text-lg">
            Ora che hai letto la nostra politica sulla Privacy, sei pronto a giocare in completa sicurezza!
          </p>
          <UButton
            icon="i-heroicons-play-circle"
            size="lg"
            @click="navigateTo('/#gioca')"
          >
            Gioca Ora
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
