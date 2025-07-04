# Prompt for Generating "Mr. White" Word Pairs

This document is structured into a System Prompt and a User Prompt. When generating word pairs, use the System Prompt to define your role and rules, and the User Prompt for the specific task.

---

## SYSTEM PROMPT

**You are an expert game designer creating content for a social deduction party game for Italian speakers.**

### 1. Game Concept

The game is a word-based social deduction game. In each round, players are secretly assigned one of two roles:
*   **Civilian**: The majority of players.
*   **Undercover**: A single player (or a small minority).

All **Civilians** receive the same secret word (the `civilian` word). The **Undercover** player receives a slightly different but closely related word (the `undercover` word).

Players take turns giving a single-word clue to describe their secret word. The goal for the Civilians is to identify the Undercover player based on clues that seem plausible but are slightly "off." The goal for the Undercover player is to blend in, deduce the civilian word, and avoid being voted out.

### 2. Critical Principles for Word Pair Selection

Follow these rules strictly:

*   **Closely Related, but Distinct**: The two words must belong to the same category or context but not be the same thing. The relationship should be lateral (e.g., two types of fruit, two types of furniture) rather than hierarchical. This subtle difference is the core of the game.
*   **Allow for Ambiguous Clues**: The pair must share enough common characteristics that they can be described with the same ambiguous clues, especially in the early rounds. This allows the Undercover player to hide effectively.
*   **AVOID Synonyms**: The words must not be direct synonyms. This would make the game impossible for the Civilians.
*   **AVOID Direct Hierarchies**: Do not use a category and a specific example of it (e.g., `Animale` and `Cane`). This makes it too easy. A pair like `{ "civilian": "Cane", "undercover": "Lupo" }` is better because they are both canids but distinct.
*   **AVOID Functional Dependencies**: Do not use pairs where one object's primary purpose is to be used with the other (e.g., `Chiave` and `Lucchetto`). This gives the relationship away too easily.
*   **Use Common Knowledge**: The words must be simple, well-known, and part of everyday Italian language and culture. Avoid niche or technical jargon.

### 3. Examples

To ensure you understand, here are examples of good and bad pairs:

*   **GOOD PAIR**: `{ "civilian": "Sedia", "undercover": "Poltrona" }`
    *   *Why it's good*: Both are for sitting, so clues like "gambe," "riposo," or "legno" could work for both. However, a clue like "comodità" or "braccioli" would point towards the `Poltrona`, creating suspicion.

*   **GOOD PAIR**: `{ "civilian": "Spada", "undercover": "Scudo" }`
    *   *Why it's good*: Both relate to combat and knights. Clues like "battaglia," "metallo," or "difesa" are ambiguous enough to create confusion and interesting gameplay.

*   **BAD PAIR**: `{ "civilian": "Auto", "undercover": "Automobile" }`
    *   *Why it's bad*: These are direct synonyms. There is no game to play.

*   **BAD PAIR**: `{ "civilian": "Pantaloni", "undercover": "Jeans" }`
    *   *Why it's bad*: `Jeans` are a *type* of `Pantaloni`. This is a direct hierarchy, which makes it too easy for the Civilians.

### 4. Required Output Format

Generate the list as a JSON array of objects. Each object must have a `civilian` key and an `undercover` key.

```json
[
  { "civilian": "Parola1", "undercover": "Parola2" },
  { "civilian": "Parola3", "undercover": "Parola4" }
]
```

---

## USER PROMPT

Your task is to generate a list of **30 new, high-quality word pairs in Italian**, following all the rules, principles, and formatting instructions defined in the System Prompt.

To avoid creating duplicates, here is the full list of word pairs already in the game. **Do not generate any of these again.**

```json
[
  { "civilian": "Mela", "undercover": "Pera" },
  { "civilian": "Cane", "undercover": "Gatto" },
  { "civilian": "Cane", "undercover": "Lupo" },
  { "civilian": "Sole", "undercover": "Luna" },
  { "civilian": "Marte", "undercover": "Giove" },
  { "civilian": "Sedia", "undercover": "Poltrona" },
  { "civilian": "Auto", "undercover": "Moto" },
  { "civilian": "Libro", "undercover": "Fumetto" },
  { "civilian": "Letto", "undercover": "Amaca" },
  { "civilian": "Forchetta", "undercover": "Coltello" },
  { "civilian": "Forchetta", "undercover": "Cucchiaio" },
  { "civilian": "Scarpa", "undercover": "Ciabatta" },
  { "civilian": "Maglietta", "undercover": "Canottiera" },
  { "civilian": "Occhiali da sole", "undercover": "Occhiali da vista" },
  { "civilian": "Orologio da polso", "undercover": "Sveglia" },
  { "civilian": "Porta", "undercover": "Finestra" },
  { "civilian": "Muro", "undercover": "Recinzione" },
  { "civilian": "Pavimento", "undercover": "Soffitto" },
  { "civilian": "Lampadina", "undercover": "Candela" },
  { "civilian": "Zaino", "undercover": "Valigia" },
  { "civilian": "Penna", "undercover": "Matita" },
  { "civilian": "Quaderno", "undercover": "Agenda" },
  { "civilian": "Forbici", "undercover": "Taglierino" },
  { "civilian": "Colla", "undercover": "Nastro adesivo" },
  { "civilian": "Moneta", "undercover": "Banconota" },
  { "civilian": "Contante", "undercover": "Carta di Credito" },
  { "civilian": "Chiave", "undercover": "Lucchetto" },
  { "civilian": "Martello", "undercover": "Cacciavite" },
  { "civilian": "Chiodo", "undercover": "Vite" },
  { "civilian": "Tastiera", "undercover": "Mouse" },
  { "civilian": "Telefono", "undercover": "Tablet" },
  { "civilian": "Password", "undercover": "PIN" },
  { "civilian": "Pizza", "undercover": "Focaccia" },
  { "civilian": "Latte", "undercover": "Yogurt" },
  { "civilian": "Pasta", "undercover": "Riso" },
  { "civilian": "Pane", "undercover": "Grissino" },
  { "civilian": "Formaggio", "undercover": "Burro" },
  { "civilian": "Bistecca", "undercover": "Salsiccia" },
  { "civilian": "Salmone", "undercover": "Tonno" },
  { "civilian": "Uovo all'occhio di bue", "undercover": "Uovo sodo" },
  { "civilian": "Pomodoro", "undercover": "Patata" },
  { "civilian": "Carota", "undercover": "Zucchina" },
  { "civilian": "Insalata", "undercover": "Spinaci" },
  { "civilian": "Arancia", "undercover": "Limone" },
  { "civilian": "Anguria", "undercover": "Melone" },
  { "civilian": "Fragola", "undercover": "Lampone" },
  { "civilian": "Zucchero", "undercover": "Sale" },
  { "civilian": "Olio", "undercover": "Aceto" },
  { "civilian": "Vino rosso", "undercover": "Vino bianco" },
  { "civilian": "Acqua", "undercover": "Succo di frutta" },
  { "civilian": "Torta", "undercover": "Biscotto" },
  { "civilian": "Gelato", "undercover": "Granita" },
  { "civilian": "Cioccolato fondente", "undercover": "Cioccolato al latte" },
  { "civilian": "Caffè espresso", "undercover": "Caffè americano" },
  { "civilian": "Minestra", "undercover": "Zuppa" },
  { "civilian": "Patatine fritte", "undercover": "Patatine in busta" },
  { "civilian": "Popcorn", "undercover": "Nachos" },
  { "civilian": "Ketchup", "undercover": "Maionese" },
  { "civilian": "Pranzo", "undercover": "Cena" },
  { "civilian": "Oceano", "undercover": "Mare" },
  { "civilian": "Spiaggia", "undercover": "Scogliera" },
  { "civilian": "Pioggia", "undercover": "Neve" },
  { "civilian": "Fuoco", "undercover": "Ghiaccio" },
  { "civilian": "Montagna", "undercover": "Collina" },
  { "civilian": "Fiume", "undercover": "Lago" },
  { "civilian": "Albero", "undercover": "Fiore" },
  { "civilian": "Erba", "undercover": "Foglia" },
  { "civilian": "Nuvola", "undercover": "Nebbia" },
  { "civilian": "Stella", "undercover": "Pianeta" },
  { "civilian": "Alba", "undercover": "Tramonto" },
  { "civilian": "Mattina", "undercover": "Pomeriggio" },
  { "civilian": "Cavallo", "undercover": "Asino" },
  { "civilian": "Mucca", "undercover": "Pecora" },
  { "civilian": "Maiale", "undercover": "Gallina" },
  { "civilian": "Leone", "undercover": "Tigre" },
  { "civilian": "Elefante", "undercover": "Giraffa" },
  { "civilian": "Scimmia", "undercover": "Gorilla" },
  { "civilian": "Pappagallo", "undercover": "Canarino" },
  { "civilian": "Pinguino", "undercover": "Foca" },
  { "civilian": "Serpente", "undercover": "Lucertola" },
  { "civilian": "Ragno", "undercover": "Scorpione" },
  { "civilian": "Ape", "undercover": "Vespa" },
  { "civilian": "Farfalla", "undercover": "Libellula" },
  { "civilian": "Formica", "undercover": "Coccinella" },
  { "civilian": "Delfino", "undercover": "Balena" },
  { "civilian": "Squalo", "undercover": "Orca" },
  { "civilian": "Granchio", "undercover": "Gambero" },
  { "civilian": "Polpo", "undercover": "Calamaro" },
  { "civilian": "Coniglio", "undercover": "Lepre" },
  { "civilian": "Topo", "undercover": "Ratto" },
  { "civilian": "Rana", "undercover": "Rospo" },
  { "civilian": "Tuono", "undercover": "Lampo" },
  { "civilian": "Nave", "undercover": "Traghetto" },
  { "civilian": "Aereo", "undercover": "Elicottero" },
  { "civilian": "Treno", "undercover": "Metropolitana" },
  { "civilian": "Scuola", "undercover": "Università" },
  { "civilian": "Ospedale", "undercover": "Clinica privata" },
  { "civilian": "Supermercato", "undercover": "Negozio" },
  { "civilian": "Ristorante", "undercover": "Bar" },
  { "civilian": "Cinema", "undercover": "Teatro" },
  { "civilian": "Piscina", "undercover": "Vasca da bagno" },
  { "civilian": "Ponte", "undercover": "Tunnel" },
  { "civilian": "Strada", "undercover": "Autostrada" },
  { "civilian": "Piazza", "undercover": "Parco" },
  { "civilian": "Giardino", "undercover": "Orto" },
  { "civilian": "Estate", "undercover": "Inverno" },
  { "civilian": "Film", "undercover": "Serie TV" },
  { "civilian": "Fotografia", "undercover": "Video" },
  { "civilian": "Notizia", "undercover": "Gossip" },
  { "civilian": "Storia", "undercover": "Leggenda" },
  { "civilian": "Matematica", "undercover": "Scienze" },
  { "civilian": "Mito", "undercover": "Favola" },
  { "civilian": "Re", "undercover": "Regina" },
  { "civilian": "Lavoro", "undercover": "Hobby" },
  { "civilian": "Sogno", "undercover": "Incubo" },
  { "civilian": "Domanda", "undercover": "Risposta" },
  { "civilian": "Bugia", "undercover": "Verità" },
  { "civilian": "Regalo", "undercover": "Sorpresa" },
  { "civilian": "Obiettivo", "undercover": "Missione" },
  { "civilian": "Fortuna", "undercover": "Sfortuna" },
  { "civilian": "Luce", "undercover": "Ombra" },
  { "civilian": "Specchio", "undercover": "Vetro" },
  { "civilian": "Maschera", "undercover": "Travestimento" },
  { "civilian": "Puzzle", "undercover": "Indovinello" },
  { "civilian": "Internet", "undercover": "Televisione" },
  { "civilian": "Parola", "undercover": "Numero" },
  { "civilian": "Errore", "undercover": "Soluzione" },
  { "civilian": "Regola", "undercover": "Eccezione" },
  { "civilian": "Dottore", "undercover": "Infermiere" },
  { "civilian": "Insegnante", "undercover": "Studente" },
  { "civilian": "Poliziotto", "undercover": "Pompiere" },
  { "civilian": "Cuoco", "undercover": "Cameriere" },
  { "civilian": "Attore", "undercover": "Regista" },
  { "civilian": "Cantante", "undercover": "Musicista" },
  { "civilian": "Scrittore", "undercover": "Giornalista" },
  { "civilian": "Pilota", "undercover": "Autista" },
  { "civilian": "Barbiere", "undercover": "Parrucchiere" },
  { "civilian": "Mano", "undercover": "Piede" },
  { "civilian": "Occhio", "undercover": "Orecchio" },
  { "civilian": "Naso", "undercover": "Bocca" },
  { "civilian": "Capelli", "undercover": "Barba" },
  { "civilian": "Dito", "undercover": "Unghia" },
  { "civilian": "Cuore", "undercover": "Cervello" },
  { "civilian": "Caldo", "undercover": "Freddo" },
  { "civilian": "Fame", "undercover": "Sete" },
  { "civilian": "Risata", "undercover": "Pianto" },
  { "civilian": "Dolore", "undercover": "Piacere" },
  { "civilian": "Paura", "undercover": "Coraggio" },
  { "civilian": "Felicità", "undercover": "Tristezza" },
  { "civilian": "Rabbia", "undercover": "Calma" },
  { "civilian": "Fantasma", "undercover": "Zombie" },
  { "civilian": "Mago", "undercover": "Strega" },
  { "civilian": "Fata", "undercover": "Elfo" },
  { "civilian": "Spada", "undercover": "Scudo" },
  { "civilian": "Castello", "undercover": "Caverna" },
  { "civilian": "Tesoro", "undercover": "Mappa" },
  { "civilian": "Pirata", "undercover": "Ninja" },
  { "civilian": "Robot", "undercover": "Alieno" },
  { "civilian": "Supereroe", "undercover": "Cattivo" },
  { "civilian": "Padel", "undercover": "Tennis" },
  { "civilian": "Facebook", "undercover": "Instagram" },
  { "civilian": "Calcio", "undercover": "Rugby" },
  { "civilian": "Carabinieri", "undercover": "Polizia" },
  { "civilian": "Motorino", "undercover": "Bicicletta" },
  { "civilian": "Prosecco", "undercover": "Champagne" },
  { "civilian": "Birra", "undercover": "Vino" },
  { "civilian": "Tiramisù", "undercover": "Panna cotta" },
  { "civilian": "Lasagna", "undercover": "Cannelloni" },
  { "civilian": "Spaghetti", "undercover": "Rigatoni" },
  { "civilian": "Limoncello", "undercover": "Grappa" },
  { "civilian": "Netflix", "undercover": "Prime Video" },
  { "civilian": "Harry Potter", "undercover": "Signore degli Anelli" },
  { "civilian": "Paradiso", "undercover": "Inferno" },
  { "civilian": "Aperitivo", "undercover": "Apericena" },
  { "civilian": "Bicchiere", "undercover": "Calice" },
  { "civilian": "Padella", "undercover": "Pentola" },
  { "civilian": "Forno", "undercover": "Microonde" },
  { "civilian": "Pepe", "undercover": "Peperoncino" },
  { "civilian": "Cipolla", "undercover": "Aglio" },
  { "civilian": "Gonna", "undercover": "Vestito" },
  { "civilian": "Anello", "undercover": "Bracciale" },
  { "civilian": "Chitarra", "undercover": "Violino" },
  { "civilian": "Pianoforte", "undercover": "Organo" },
  { "civilian": "Flauto", "undercover": "Tromba" },
  { "civilian": "Scacchi", "undercover": "Dama" },
  { "civilian": "Vela", "undercover": "Surf" },
  { "civilian": "Pennello", "undercover": "Spatola" },
  { "civilian": "Tela", "undercover": "Affresco" },
  { "civilian": "Foresta", "undercover": "Giungla" },
  { "civilian": "Isola", "undercover": "Penisola" },
  { "civilian": "Vulcano", "undercover": "Terremoto" },
  { "civilian": "Grotta", "undercover": "Miniera" },
  { "civilian": "Biblioteca", "undercover": "Libreria" },
  { "civilian": "Museo", "undercover": "Galleria d'arte" },
  { "civilian": "Stadio", "undercover": "Palazzetto dello Sport" },
  { "civilian": "Hotel", "undercover": "Ostello" },
  { "civilian": "Camper", "undercover": "Roulotte" },
  { "civilian": "Magia", "undercover": "Illusione" },
  { "civilian": "Poesia", "undercover": "Prosa" },
  { "civilian": "Rumore", "undercover": "Suono" },
  { "civilian": "Lettera", "undercover": "Email" },
  { "civilian": "Panettone", "undercover": "Pandoro" },
  { "civilian": "Prosciutto crudo", "undercover": "Prosciutto cotto" },
  { "civilian": "Armadio", "undercover": "Cassettiera" },
  { "civilian": "Violino", "undercover": "Violoncello" },
  { "civilian": "Tè", "undercover": "Camomilla" },
  { "civilian": "Basket", "undercover": "Pallavolo" },
  { "civilian": "Sci", "undercover": "Snowboard" },
  { "civilian": "Pittore", "undercover": "Scultore" },
  { "civilian": "Amore", "undercover": "Amicizia" },
  { "civilian": "Città", "undercover": "Paese" },
  { "civilian": "Autobus", "undercover": "Tram" },
  { "civilian": "Monopattino", "undercover": "Skateboard" },
  { "civilian": "Romanzo", "undercover": "Racconto" },
  { "civilian": "Giornale", "undercover": "Rivista" },
  { "civilian": "Passaporto", "undercover": "Carta d'identità" },
  { "civilian": "Farmacia", "undercover": "Parafarmacia" },
  { "civilian": "Albergo", "undercover": "Bed & Breakfast" },
  { "civilian": "Aquila", "undercover": "Falco" },
  { "civilian": "Calamita", "undercover": "Bussola" },
  { "civilian": "Dipinto", "undercover": "Disegno" },
  { "civilian": "Fratello", "undercover": "Sorella" },
  { "civilian": "Ruscello", "undercover": "Torrente" },
  { "civilian": "Stivale", "undercover": "Mocassino" },
  { "civilian": "Destino", "undercover": "Casualità" },
]
```

**Now, please generate 50 new word pairs.**
