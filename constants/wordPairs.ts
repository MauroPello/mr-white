import type { WordPair } from "~/types/wordPairs"; // Assuming types/wordPairs.ts exists

export const wordPairs: WordPair[] = [
  { civilian: "Mela", undercover: "Pera" },
  { civilian: "Cane", undercover: "Gatto" }, // Cane/Lupo è ok, Cane/Gatto è più comune
  { civilian: "Sole", undercover: "Luna" },
  { civilian: "Sedia", undercover: "Poltrona" }, // Poltrona invece di sgabello
  { civilian: "Caffè", undercover: "Cappuccino" }, // Tè è ok, cappuccino è più vicino
  { civilian: "Auto", undercover: "Moto" }, // Moto invece di bici
  { civilian: "Libro", undercover: "Fumetto" }, // Fumetto invece di rivista
  { civilian: "Pizza", undercover: "Focaccia" }, // Focaccia invece di hamburger
  { civilian: "Oceano", undercover: "Mare" }, // Mare invece di lago
  { civilian: "Chitarra", undercover: "Basso" }, // Basso invece di violino
  { civilian: "Estate", undercover: "Primavera" }, // Primavera invece di inverno
  { civilian: "Dottore", undercover: "Dentista" }, // Dentista invece di infermiere
  { civilian: "Film", undercover: "Cartone animato" }, // Cartone invece di Serie TV
  { civilian: "Password", undercover: "PIN" }, // PIN invece di username
  { civilian: "Latte", undercover: "Yogurt" }, // Yogurt invece di acqua
  { civilian: "Spiaggia", undercover: "Scogliera" }, // Scogliera invece di deserto
  { civilian: "Letto", undercover: "Amaca" }, // Amaca invece di divano
  { civilian: "Calcio", undercover: "Rugby" }, // Rugby invece di basket
  { civilian: "Pioggia", undercover: "Grandine" }, // Grandine invece di neve
  { civilian: "Pasta", undercover: "Gnocchi" }, // Gnocchi invece di riso
  { civilian: "Telefono", undercover: "Tablet" }, // Tablet invece di computer
  { civilian: "Forchetta", undercover: "Coltello" }, // Coltello invece di cucchiaio
  { civilian: "Nave", undercover: "Traghetto" }, // Traghetto invece di barca
  { civilian: "Aereo", undercover: "Jet privato" }, // Jet invece di elicottero
  { civilian: "Treno", undercover: "Metropolitana" }, // Metro invece di autobus
  { civilian: "Scarpa", undercover: "Ciabatta" }, // Ciabatta invece di stivale
  { civilian: "Maglietta", undercover: "Canottiera" }, // Canottiera invece di camicia
  { civilian: "Pantaloni", undercover: "Jeans" }, // Jeans invece di gonna
  { civilian: "Cappello", undercover: "Casco" }, // Casco invece di berretto
  { civilian: "Guanti", undercover: "Muffole" }, // Muffole invece di sciarpa
  { civilian: "Occhiali da sole", undercover: "Occhiali da vista" }, // Da sole vs vista
  { civilian: "Orologio da polso", undercover: "Orologio da tasca" }, // Polso vs tasca
  { civilian: "Porta", undercover: "Cancello" }, // Cancello invece di finestra
  { civilian: "Muro", undercover: "Recinzione" }, // Recinzione invece di soffitto
  { civilian: "Pavimento", undercover: "Moquette" }, // Moquette invece di tappeto
  { civilian: "Lampadina", undercover: "Neon" }, // Neon invece di candela
  { civilian: "Fuoco", undercover: "Brace" }, // Brace invece di ghiaccio
  { civilian: "Montagna", undercover: "Vulcano" }, // Vulcano invece di collina
  { civilian: "Fiume", undercover: "Torrente" }, // Torrente invece di cascata
  { civilian: "Albero", undercover: "Arbusto" }, // Arbusto invece di fiore
  { civilian: "Erba", undercover: "Muschio" }, // Muschio invece di foglia
  { civilian: "Nuvola", undercover: "Fumo" }, // Fumo invece di nebbia
  { civilian: "Stella", undercover: "Cometa" }, // Cometa invece di pianeta
  { civilian: "Scuola elementare", undercover: "Asilo nido" }, // Elementare vs Nido
  { civilian: "Ospedale", undercover: "Pronto soccorso" }, // Pronto soccorso vs clinica
  { civilian: "Supermercato", undercover: "Mercato" }, // Mercato vs negozio
  { civilian: "Ristorante", undercover: "Trattoria" }, // Trattoria vs bar
  { civilian: "Cinema", undercover: "Drive-in" }, // Drive-in vs teatro
  { civilian: "Museo", undercover: "Biblioteca" }, // Biblioteca vs galleria
  { civilian: "Zaino", undercover: "Valigia" }, // Valigia vs borsa
  { civilian: "Penna", undercover: "Pennarello" }, // Pennarello vs matita
  { civilian: "Quaderno", undercover: "Blocco note" }, // Blocco note vs agenda
  { civilian: "Forbici", undercover: "Taglierino" }, // Taglierino vs coltello
  { civilian: "Colla", undercover: "Vinavil" }, // Vinavil vs nastro adesivo
  { civilian: "Moneta", undercover: "Banconota" }, // Moneta vs carta di credito
  { civilian: "Chiave", undercover: "Password" }, // Password vs lucchetto (più astratto)
  { civilian: "Martello", undercover: "Mazza" }, // Mazza vs cacciavite
  { civilian: "Chiodo", undercover: "Tassello" }, // Tassello vs vite
  { civilian: "Dipinto", undercover: "Affresco" }, // Affresco vs disegno
  { civilian: "Musica Classica", undercover: "Musica Jazz" }, // Classica vs Jazz
  { civilian: "Ballo Liscio", undercover: "Tango" }, // Liscio vs Tango
  { civilian: "Fotografia digitale", undercover: "Fotografia analogica" }, // Digitale vs Analogica
  { civilian: "Notizia", undercover: "Articolo di opinione" }, // Opinione vs Gossip
  { civilian: "Storia", undercover: "Biografia" }, // Biografia vs Leggenda
  { civilian: "Algebra", undercover: "Geometria" }, // Algebra vs Fisica
  { civilian: "Chimica", undercover: "Biologia" }, // Chimica vs Magia
  { civilian: "Mito", undercover: "Favola" }, // Favola vs Filosofia
  { civilian: "Re", undercover: "Regina" }, // Regina vs Economia

  // Cibo e Bevande (Più Varietà)
  { civilian: "Pane", undercover: "Pizza bianca" }, // Pizza bianca vs Grissino
  { civilian: "Formaggio", undercover: "Ricotta" }, // Ricotta vs Burro
  { civilian: "Bistecca", undercover: "Salsiccia" }, // Salsiccia vs Pesce
  { civilian: "Salmone", undercover: "Tonno" }, // Tonno vs Tacchino
  { civilian: "Uovo sodo", undercover: "Uovo strapazzato" }, // Strapazzato vs Frittata
  { civilian: "Pomodoro", undercover: "Peperone" }, // Peperone vs Patata
  { civilian: "Carota", undercover: "Zucchina" }, // Zucchina vs Aglio
  { civilian: "Insalata", undercover: "Rucola" }, // Rucola vs Spinaci
  { civilian: "Mandarino", undercover: "Pompelmo" }, // Pompelmo vs Limone
  { civilian: "Anguria", undercover: "Melone" }, // Melone vs Kiwi
  { civilian: "Mirtillo", undercover: "Mora" }, // Mora vs Lampone
  { civilian: "Zucchero", undercover: "Miele" }, // Miele vs Sale
  { civilian: "Olio d'oliva", undercover: "Olio di semi" }, // Semi vs Aceto
  { civilian: "Vino rosso", undercover: "Vino bianco" }, // Bianco vs Birra
  { civilian: "Succo di frutta", undercover: "Centrifuga" }, // Centrifuga vs Frullato
  { civilian: "Torta", undercover: "Croissant" }, // Croissant vs Biscotto
  { civilian: "Gelato", undercover: "Granita" }, // Granita vs Sorbetto
  { civilian: "Cioccolato fondente", undercover: "Cioccolato al latte" }, // Latte vs Caramella
  { civilian: "Caffè espresso", undercover: "Caffè americano" },
  { civilian: "Tisana", undercover: "Camomilla" },
  { civilian: "Lasagna", undercover: "Cannelloni" },
  { civilian: "Minestra", undercover: "Zuppa" },
  { civilian: "Patatine fritte", undercover: "Patatine in busta" },
  { civilian: "Popcorn", undercover: "Nachos" },
  { civilian: "Ketchup", undercover: "Maionese" },
  { civilian: "Senape", undercover: "Salsa barbecue" },

  // Animali (Più Varietà)
  { civilian: "Cavallo", undercover: "Zebra" }, // Zebra vs Asino
  { civilian: "Mucca", undercover: "Bufala" }, // Bufala vs Pecora
  { civilian: "Maiale", undercover: "Capra" }, // Capra vs Cinghiale
  { civilian: "Leone", undercover: "Puma" }, // Puma vs Tigre
  { civilian: "Elefante", undercover: "Ippopotamo" }, // Ippopotamo vs Rinoceronte
  { civilian: "Scimmia", undercover: "Lemure" }, // Lemure vs Gorilla
  { civilian: "Pappagallo", undercover: "Corvo" }, // Corvo vs Pipistrello
  { civilian: "Gufo", undercover: "Civetta" }, // Civetta vs Falco
  { civilian: "Pinguino", undercover: "Pulcinella di mare" }, // Pulcinella vs Foca
  { civilian: "Cobra", undercover: "Vipera" }, // Vipera vs Lucertola
  { civilian: "Ragno", undercover: "Tarantola" }, // Tarantola vs Scorpione
  { civilian: "Ape", undercover: "Bombo" }, // Bombo vs Vespa
  { civilian: "Farfalla", undercover: "Libellula" }, // Libellula vs Falena
  { civilian: "Formica", undercover: "Scarabeo" }, // Scarabeo vs Termite
  { civilian: "Delfino", undercover: "Balena" },
  { civilian: "Squalo", undercover: "Orca" },
  { civilian: "Granchio", undercover: "Aragosta" },
  { civilian: "Polpo", undercover: "Calamaro" },
  { civilian: "Stella marina", undercover: "Riccio di mare" },
  { civilian: "Coniglio", undercover: "Lepre" },
  { civilian: "Criceto", undercover: "Porcellino d'India" },
  { civilian: "Coccodrillo", undercover: "Alligatore" },
  { civilian: "Tartaruga", undercover: "Testuggine" },
  { civilian: "Rana", undercover: "Rospo" },

  // Corpo Umano e Sensazioni (Più Varietà)
  { civilian: "Mano", undercover: "Braccio" }, // Braccio vs Piede
  { civilian: "Occhio", undercover: "Sopracciglio" }, // Sopracciglio vs Orecchio
  { civilian: "Naso", undercover: "Guancia" }, // Guancia vs Bocca
  { civilian: "Capelli", undercover: "Ciglia" }, // Ciglia vs Barba
  { civilian: "Dito", undercover: "Pollice" }, // Pollice vs Unghia
  { civilian: "Cuore", undercover: "Polmone" }, // Polmone vs Cervello
  { civilian: "Stomaco", undercover: "Intestino" }, // Intestino vs Linfa
  { civilian: "Ginocchio", undercover: "Gomito" }, // Gomito vs Muscolo
  { civilian: "Pelle", undercover: "Cicatrice" }, // Cicatrice vs Pelliccia
  { civilian: "Voce", undercover: "Sussurro" }, // Sussurro vs Freddo
  { civilian: "Risata", undercover: "Sbadiglio" }, // Sbadiglio vs Tristezza
  { civilian: "Dolore", undercover: "Prurito" }, // Prurito vs Coraggio
  { civilian: "Piacere", undercover: "Sollievo" }, // Sollievo vs Calma
  { civilian: "Nostalgia", undercover: "Rimpianto" }, // Rimpianto vs Noia
  { civilian: "Ansia", undercover: "Stress" }, // Stress vs Odio
  { civilian: "Curiosità", undercover: "Dubbio" }, // Dubbio vs Sete
  { civilian: "Orgoglio", undercover: "Vanità" }, // Vanità vs Stanchezza

  // Fantasy, Fiction & Fun (Più Varietà)
  { civilian: "Fantasma", undercover: "Spirito" }, // Spirito vs Alieno
  { civilian: "Vampiro", undercover: "Licantropo" }, // Licantropo vs Zombie
  { civilian: "Mago", undercover: "Strega" }, // Strega vs Cattivo
  { civilian: "Elfo", undercover: "Nano" }, // Nano vs Unicorno
  { civilian: "Spada", undercover: "Ascia" }, // Ascia vs Scudo
  { civilian: "Castello", undercover: "Fortezza" }, // Fortezza vs Caverna
  { civilian: "Tesoro", undercover: "Reliquia" }, // Reliquia vs Mappa
  { civilian: "Pirata", undercover: "Corsaro" }, // Corsaro vs Ninja
  { civilian: "Robot", undercover: "Droide" }, // Droide vs Cyborg
  { civilian: "Viaggio nel tempo", undercover: "Teletrasporto" }, // Teletrasporto vs Tempo
  { civilian: "Sogno", undercover: "Visione" }, // Visione vs Incubo
  { civilian: "Indovinello", undercover: "Proverbio" }, // Proverbio vs Verità
  { civilian: "Codice segreto", undercover: "Messaggio cifrato" }, // Cifrato vs Indizio
  { civilian: "Regalo", undercover: "Donazione" }, // Donazione vs Sorpresa
  { civilian: "Festa di compleanno", undercover: "Matrimonio" }, // Matrimonio vs Riunione
  { civilian: "Hobby", undercover: "Passione" }, // Passione vs Lavoro
  { civilian: "Obiettivo", undercover: "Missione" }, // Missione vs Sfortuna
  { civilian: "Coincidenza", undercover: "Deja-vu" }, // Deja-vu vs Caso
  { civilian: "Silenzio", undercover: "Eco" }, // Eco vs Rumore
  { civilian: "Luce", undercover: "Riflesso" }, // Riflesso vs Ombra
  { civilian: "Specchio", undercover: "Lente" }, // Lente vs Ritratto
  { civilian: "Maschera", undercover: "Casco" }, // Casco vs Travestimento
  { civilian: "Puzzle", undercover: "Labirinto" }, // Labirinto vs Enigma
  { civilian: "Tastiera", undercover: "Mouse" }, // Mouse vs Schermo
  { civilian: "Internet", undercover: "Intranet" }, // Intranet vs Illusione
  { civilian: "Notte", undercover: "Giorno" }, // Giorno vs Fatto
  { civilian: "Parola", undercover: "Lettera" }, // Lettera vs Fine
  { civilian: "Numero", undercover: "Simbolo" }, // Simbolo vs Risposta
  { civilian: "Errore", undercover: "Bug" }, // Bug vs Soluzione
  { civilian: "Regola", undercover: "Legge" }, // Legge vs Eccezione
  { civilian: "Astronauta", undercover: "Cosmonauta" },
  { civilian: "Pilota", undercover: "Capitano" },
  { civilian: "Cuoco", undercover: "Pasticcere" },
  { civilian: "Attore", undercover: "Comico" },
  { civilian: "Cantante", undercover: "Rapper" },
  { civilian: "Scrittore", undercover: "Poeta" },
  { civilian: "Professore", undercover: "Maestro" },
  { civilian: "Poliziotto", undercover: "Carabiniere" },
  { civilian: "Pompiere", undercover: "Paramedico" }, // O "Vigile del fuoco"
  { civilian: "Giardiniere", undercover: "Fioraio" },
  { civilian: "Barbiere", undercover: "Parrucchiere" },

  // Altre Coppie Varie
  { civilian: "Piscina", undercover: "Vasca idromassaggio" },
  { civilian: "Tenda da campeggio", undercover: "Sacco a pelo" },
  { civilian: "Bussola", undercover: "GPS" },
  { civilian: "Mappa", undercover: "Globo" },
  { civilian: "Termometro", undercover: "Barometro" },
  { civilian: "Microscopio", undercover: "Telescopio" },
  { civilian: "Batteria", undercover: "Caricabatterie" },
  { civilian: "Cavo", undercover: "Adattatore" },
  { civilian: "Presa elettrica", undercover: "Interruttore" },
  { civilian: "Scala", undercover: "Ascensore" },
  { civilian: "Ponte", undercover: "Tunnel" },
  { civilian: "Strada", undercover: "Sentiero" },
  { civilian: "Piazza", undercover: "Rotonda" },
  { civilian: "Parco", undercover: "Giardino" },
  { civilian: "Semaforo", undercover: "Stop" },
  { civilian: "Biglietto del treno", undercover: "Abbonamento" },
  { civilian: "Francobollo", undercover: "Busta" },
  { civilian: "Monopoli", undercover: "Risiko" },
  { civilian: "Scacchi", undercover: "Dama" },
  { civilian: "Carte da gioco", undercover: "Tarocchi" },
  { civilian: "Dado", undercover: "Trottola" },
  { civilian: "Pallone", undercover: "Palla" },
  { civilian: "Corda per saltare", undercover: "Hula hoop" },
  { civilian: "Altalena", undercover: "Scivolo" },
];
