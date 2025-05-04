import type { WordPair } from "~/types/wordPairs";

export const wordPairs: WordPair[] = [
  // Basics & Common Objects
  { civilian: "Mela", undercover: "Pera" }, // Good classic
  { civilian: "Cane", undercover: "Gatto" }, // Good classic
  { civilian: "Sole", undercover: "Luna" }, // Good classic
  { civilian: "Sedia", undercover: "Poltrona" }, // Good, subtle difference
  { civilian: "Auto", undercover: "Moto" }, // Good
  { civilian: "Libro", undercover: "Fumetto" }, // Good
  { civilian: "Letto", undercover: "Amaca" }, // Good contrast
  { civilian: "Forchetta", undercover: "Coltello" }, // Good, same context
  { civilian: "Scarpa", undercover: "Ciabatta" }, // Good, footwear
  { civilian: "Maglietta", undercover: "Canottiera" }, // Good, clothing layers
  { civilian: "Pantaloni", undercover: "Jeans" }, // Excellent, specific type
  { civilian: "Cappello", undercover: "Berretto" }, // Changed Casco to Berretto for closer type
  { civilian: "Guanti", undercover: "Muffole" }, // Good specific type
  { civilian: "Occhiali da sole", undercover: "Occhiali da vista" }, // Excellent
  { civilian: "Orologio da polso", undercover: "Sveglia" }, // Changed da tasca (less common) to Sveglia (time-telling device)
  { civilian: "Porta", undercover: "Finestra" }, // Changed Cancello to Finestra (openings in a wall)
  { civilian: "Muro", undercover: "Recinzione" }, // Good
  { civilian: "Pavimento", undercover: "Soffitto" }, // Changed Moquette to Soffitto (parts of a room)
  { civilian: "Lampadina", undercover: "Candela" }, // Changed Neon (less common?) to Candela (light source)
  { civilian: "Zaino", undercover: "Valigia" }, // Good
  { civilian: "Penna", undercover: "Matita" }, // Changed Pennarello to Matita (more common writing tool pair)
  { civilian: "Quaderno", undercover: "Agenda" }, // Changed Blocco note to Agenda (more distinct purpose)
  { civilian: "Forbici", undercover: "Taglierino" }, // Good
  { civilian: "Colla", undercover: "Nastro adesivo" }, // Replaced Vinavil (brand) with common alternative
  { civilian: "Moneta", undercover: "Banconota" }, // Good
  { civilian: "Chiave", undercover: "Lucchetto" }, // Changed Password to Lucchetto (physical security)
  { civilian: "Martello", undercover: "Cacciavite" }, // Changed Mazza to Cacciavite (common tools)
  { civilian: "Chiodo", undercover: "Vite" }, // Changed Tassello to Vite (common fasteners)
  { civilian: "Tastiera", undercover: "Mouse" }, // Good tech pair
  { civilian: "Telefono", undercover: "Tablet" }, // Good tech pair
  { civilian: "Password", undercover: "PIN" }, // Excellent digital security pair

  // Food & Drinks
  { civilian: "Caffè", undercover: "Cappuccino" }, // Good
  { civilian: "Pizza", undercover: "Focaccia" }, // Excellent
  { civilian: "Latte", undercover: "Yogurt" }, // Good
  { civilian: "Pasta", undercover: "Riso" }, // Changed Gnocchi to Riso (common staples)
  { civilian: "Pane", undercover: "Grissino" }, // Changed Pizza bianca to Grissino (baked goods)
  { civilian: "Formaggio", undercover: "Burro" }, // Changed Ricotta to Burro (dairy products)
  { civilian: "Bistecca", undercover: "Salsiccia" }, // Good
  { civilian: "Salmone", undercover: "Tonno" }, // Good
  { civilian: "Uovo fritto", undercover: "Uovo sodo" }, // Changed strapazzato to fritto for clearer contrast
  { civilian: "Pomodoro", undercover: "Patata" }, // Changed Peperone to Patata (very common vegetables)
  { civilian: "Carota", undercover: "Zucchina" }, // Good
  { civilian: "Insalata", undercover: "Spinaci" }, // Changed Rucola to Spinaci (leafy greens)
  { civilian: "Arancia", undercover: "Limone" }, // Changed Mandarino/Pompelmo to classic citrus pair
  { civilian: "Anguria", undercover: "Melone" }, // Good
  { civilian: "Fragola", undercover: "Lampone" }, // Changed Mirtillo/Mora to more common berries
  { civilian: "Zucchero", undercover: "Sale" }, // Changed Miele to Sale (fundamental seasonings)
  { civilian: "Olio", undercover: "Aceto" }, // Simplified Olio pair, common condiments
  { civilian: "Vino rosso", undercover: "Vino bianco" }, // Good
  { civilian: "Acqua", undercover: "Succo di frutta" }, // Changed Tisana/Camomilla, Yogurt/Acqua to this basic pair
  { civilian: "Torta", undercover: "Biscotto" }, // Changed Croissant to Biscotto (common sweets)
  { civilian: "Gelato", undercover: "Granita" }, // Good
  { civilian: "Cioccolato fondente", undercover: "Cioccolato al latte" }, // Excellent
  { civilian: "Caffè espresso", undercover: "Caffè americano" }, // Good
  { civilian: "Minestra", undercover: "Zuppa" }, // Good subtle difference
  { civilian: "Patatine fritte", undercover: "Patatine in busta" }, // Excellent
  { civilian: "Popcorn", undercover: "Nachos" }, // Good snack pair
  { civilian: "Ketchup", undercover: "Maionese" }, // Good condiment pair

  // Nature & Environment
  { civilian: "Oceano", undercover: "Mare" }, // Good
  { civilian: "Spiaggia", undercover: "Scogliera" }, // Good
  { civilian: "Pioggia", undercover: "Neve" }, // Changed Grandine to Neve (more common weather contrast)
  { civilian: "Fuoco", undercover: "Ghiaccio" }, // Changed Brace to Ghiaccio (classic elements)
  { civilian: "Montagna", undercover: "Collina" }, // Changed Vulcano to Collina (difference in scale)
  { civilian: "Fiume", undercover: "Lago" }, // Changed Torrente to Lago (different bodies of water)
  { civilian: "Albero", undercover: "Fiore" }, // Changed Arbusto to Fiore (common plants)
  { civilian: "Erba", undercover: "Foglia" }, // Changed Muschio to Foglia (parts of plants)
  { civilian: "Nuvola", undercover: "Nebbia" }, // Changed Fumo to Nebbia (weather phenomena)
  { civilian: "Stella", undercover: "Pianeta" }, // Changed Cometa to Pianeta (common celestial bodies)
  { civilian: "Alba", undercover: "Tramonto" }, // New: Dawn/Sunset, very common and evocative

  // Animals
  { civilian: "Cavallo", undercover: "Asino" }, // Changed Zebra to Asino (more common relative)
  { civilian: "Mucca", undercover: "Pecora" }, // Changed Bufala to Pecora (common farm animals)
  { civilian: "Maiale", undercover: "Gallina" }, // Changed Capra to Gallina (common farm animals)
  { civilian: "Leone", undercover: "Tigre" }, // Changed Puma to Tigre (classic big cat pair)
  { civilian: "Elefante", undercover: "Giraffa" }, // Changed Ippopotamo to Giraffa (iconic large animals)
  { civilian: "Scimmia", undercover: "Gorilla" }, // Good specific type
  { civilian: "Pappagallo", undercover: "Canarino" }, // Changed Corvo to Canarino (common pet birds)
  { civilian: "Gufo", undercover: "Civetta" }, // Good
  { civilian: "Pinguino", undercover: "Foca" }, // Changed Pulcinella (obscure) to Foca (common marine animal)
  { civilian: "Serpente", undercover: "Lucertola" }, // Changed Cobra/Vipera to general Serpente/Lucertola (common reptiles)
  { civilian: "Ragno", undercover: "Scorpione" }, // Changed Tarantola to Scorpione (common creepy crawlies)
  { civilian: "Ape", undercover: "Vespa" }, // Changed Bombo to Vespa (common stinging insects)
  { civilian: "Farfalla", undercover: "Libellula" }, // Good
  { civilian: "Formica", undercover: "Coccinella" }, // Changed Scarabeo to Coccinella (common small insects)
  { civilian: "Delfino", undercover: "Balena" }, // Good
  { civilian: "Squalo", undercover: "Orca" }, // Good
  { civilian: "Granchio", undercover: "Gambero" }, // Changed Aragosta to Gambero (more common crustacean)
  { civilian: "Polpo", undercover: "Calamaro" }, // Good
  { civilian: "Coniglio", undercover: "Lepre" }, // Good
  { civilian: "Topo", undercover: "Ratto" }, // Changed Criceto/Porcellino to common rodents
  { civilian: "Coccodrillo", undercover: "Alligatore" }, // Good
  { civilian: "Tartaruga", undercover: "Testuggine" }, // Excellent
  { civilian: "Rana", undercover: "Rospo" }, // Good

  // Places & Transport
  { civilian: "Nave", undercover: "Traghetto" }, // Good
  { civilian: "Aereo", undercover: "Elicottero" }, // Changed Jet privato to Elicottero (more common aircraft contrast)
  { civilian: "Treno", undercover: "Metropolitana" }, // Good
  { civilian: "Scuola", undercover: "Università" }, // Simplified elementare/asilo to broader terms
  { civilian: "Ospedale", undercover: "Clinica" }, // Changed Pronto soccorso to Clinica (types of medical facilities)
  { civilian: "Supermercato", undercover: "Negozio" }, // Changed Mercato to Negozio (general store)
  { civilian: "Ristorante", undercover: "Bar" }, // Changed Trattoria to Bar (common eateries)
  { civilian: "Cinema", undercover: "Teatro" }, // Changed Drive-in to Teatro (performance venues)
  { civilian: "Museo", undercover: "Galleria d'arte" }, // Changed Biblioteca to Galleria (places for viewing art/artifacts)
  { civilian: "Piscina", undercover: "Vasca da bagno" }, // Changed idromassaggio to basic Vasca da bagno
  { civilian: "Ponte", undercover: "Tunnel" }, // Good
  { civilian: "Strada", undercover: "Autostrada" }, // Changed Sentiero to Autostrada (types of roads)
  { civilian: "Piazza", undercover: "Parco" }, // Changed Rotonda to Parco (public spaces)
  { civilian: "Giardino", undercover: "Orto" }, // Changed Parco to Orto (cultivated spaces)

  // Abstract & Concepts
  { civilian: "Estate", undercover: "Inverno" }, // Changed Primavera to Inverno (stronger contrast)
  { civilian: "Film", undercover: "Serie TV" }, // Changed Cartone to Serie TV (very common media formats)
  { civilian: "Musica", undercover: "Silenzio" }, // Changed Classica/Jazz to broader Musica/Silenzio
  { civilian: "Fotografia", undercover: "Video" }, // Simplified digital/analogica to Fotografia/Video
  { civilian: "Notizia", undercover: "Gossip" }, // Changed Articolo opinione to Gossip (accessible info types)
  { civilian: "Storia", undercover: "Leggenda" }, // Changed Biografia to Leggenda (types of narratives)
  { civilian: "Matematica", undercover: "Scienze" }, // Broadened Algebra/Geo, Chimica/Bio
  { civilian: "Mito", undercover: "Favola" }, // Good
  { civilian: "Re", undercover: "Regina" }, // Good
  { civilian: "Lavoro", undercover: "Hobby" }, // Changed Passione, good contrast
  { civilian: "Sogno", undercover: "Incubo" }, // Changed Visione to Incubo (common dream types)
  { civilian: "Domanda", undercover: "Risposta" }, // Changed Indovinello/Proverbio to basic pair
  { civilian: "Bugia", undercover: "Verità" }, // Changed Codice segreto etc. to this fundamental pair
  { civilian: "Regalo", undercover: "Sorpresa" }, // Changed Donazione to Sorpresa
  { civilian: "Festa", undercover: "Riunione" }, // Simplified compleanno/matrimonio
  { civilian: "Obiettivo", undercover: "Missione" }, // Good
  { civilian: "Fortuna", undercover: "Sfortuna" }, // Changed Coincidenza/Deja-vu to basic luck
  { civilian: "Luce", undercover: "Ombra" }, // Changed Riflesso to Ombra (classic contrast)
  { civilian: "Specchio", undercover: "Vetro" }, // Changed Lente to Vetro (reflective/transparent)
  { civilian: "Maschera", undercover: "Travestimento" }, // Good, as suggested
  { civilian: "Puzzle", undercover: "Indovinello" }, // Changed Labirinto to Indovinello (mental challenges)
  { civilian: "Internet", undercover: "Televisione" }, // Changed Intranet to Televisione (mass media)
  { civilian: "Parola", undercover: "Numero" }, // Changed Lettera to Numero (basic symbols)
  { civilian: "Errore", undercover: "Soluzione" }, // Changed Bug to Soluzione (problem/answer)
  { civilian: "Regola", undercover: "Eccezione" }, // Changed Legge to Eccezione (rule/breaking it)

  // Professions
  { civilian: "Dottore", undercover: "Infermiere" }, // Changed Dentista to Infermiere (common medical roles)
  { civilian: "Insegnante", undercover: "Studente" }, // Changed Professore/Maestro to general roles
  { civilian: "Poliziotto", undercover: "Pompiere" }, // Changed Carabiniere to Pompiere (emergency services)
  { civilian: "Cuoco", undercover: "Cameriere" }, // Changed Pasticcere to Cameriere (restaurant roles)
  { civilian: "Attore", undercover: "Regista" }, // Changed Comico to Regista (film roles)
  { civilian: "Cantante", undercover: "Musicista" }, // Changed Rapper to Musicista (broader music role)
  { civilian: "Scrittore", undercover: "Giornalista" }, // Changed Poeta to Giornalista (writing professions)
  { civilian: "Pilota", undercover: "Autista" }, // Changed Capitano to Autista (driving roles)
  { civilian: "Barbiere", undercover: "Parrucchiere" }, // Good

  // Body & Sensations
  { civilian: "Mano", undercover: "Piede" }, // Changed Braccio to Piede (extremities)
  { civilian: "Occhio", undercover: "Orecchio" }, // Changed Sopracciglio to Orecchio (sensory organs)
  { civilian: "Naso", undercover: "Bocca" }, // Changed Guancia to Bocca (facial features)
  { civilian: "Capelli", undercover: "Barba" }, // Changed Ciglia to Barba (types of hair)
  { civilian: "Dito", undercover: "Unghia" }, // Changed Pollice to Unghia (part of finger)
  { civilian: "Cuore", undercover: "Cervello" }, // Changed Polmone to Cervello (vital organs)
  { civilian: "Caldo", undercover: "Freddo" }, // Changed Stomaco/Intestino to basic temperatures
  { civilian: "Fame", undercover: "Sete" }, // Changed Ginocchio/Gomito to basic needs
  { civilian: "Risata", undercover: "Pianto" }, // Changed Sbadiglio to Pianto (emotional expressions)
  { civilian: "Dolore", undercover: "Piacere" }, // Changed Prurito to Piacere (opposite sensations)
  { civilian: "Paura", undercover: "Coraggio" }, // Changed Nostalgia/Rimpianto etc. to basic emotions
  { civilian: "Felicità", undercover: "Tristezza" }, // Basic emotion pair
  { civilian: "Rabbia", undercover: "Calma" }, // Basic emotion pair

  // Fantasy & Fun (Simplified)
  { civilian: "Fantasma", undercover: "Zombie" }, // Changed Spirito to Zombie (common monsters)
  { civilian: "Vampiro", undercover: "Licantropo" }, // Good
  { civilian: "Mago", undercover: "Strega" }, // Good
  { civilian: "Fata", undercover: "Elfo" }, // Changed Nano to Fata (mythical beings)
  { civilian: "Spada", undercover: "Scudo" }, // Changed Ascia to Scudo (attack/defense)
  { civilian: "Castello", undercover: "Caverna" }, // Changed Fortezza to Caverna (dwellings)
  { civilian: "Tesoro", undercover: "Mappa" }, // Good, replacing Reliquia
  { civilian: "Pirata", undercover: "Ninja" }, // Changed Corsaro/Esploratore to Ninja (popular archetypes)
  { civilian: "Robot", undercover: "Alieno" }, // Changed Cyborg to Alieno (sci-fi beings)
  { civilian: "Supereroe", undercover: "Cattivo" }, // New: Classic comic book roles (Villain)
];
