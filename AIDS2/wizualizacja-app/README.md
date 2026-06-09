# Wizualizacja algorytmow — Królestwo Krasnoludkow

Frontendowa aplikacja w React, napisana w JavaScript, uruchamiana przez Vite.
Cala grafika to recznie rysowany SVG, bez zewnetrznych bibliotek do wykresow.

## Stos technologiczny

- **React 18** — komponenty funkcyjne z hookami (useState, useEffect)
- **Vite 5** — serwer deweloperski i bundler
- **JavaScript (JSX)** — czysty JS, bez TypeScriptu
- **SVG** — recznie rysowana grafika (sieci przeplywowe, drzewa, otoczki, mapy)
- **Brak zewnetrznych bibliotek UI** — zero zaleznosci poza React i ReactDOM

## Uruchomienie

```bash
cd wizualizacja-app

# Instalacja zaleznosci (tylko raz)
npm install

# Serwer deweloperski (hot-reload na http://localhost:5173)
npm run dev

# Build produkcyjny (katalog dist/)
npm run build

# Podglad buildu
npm run preview
```

## Co pokazuje

### Tryb 1: Wizualizacja krok po kroku

Kazdy z 4 modulow z osobna, z animacja krok po kroku:

| Modul | Algorytm | Co widac |
|-------|----------|----------|
| M1 | Min-Cost Max-Flow (SPFA) | Siec przeplywowa, pulsujace sciezki, przydzial krasnali |
| M2 | Otoczka wypukla (Andrew) | Mapa kopalni, gumka naciagana na punkty |
| M3 | Drzewo przedzialowe (RMQ) | Drzewo binarne z podswietlaniem wezlow, zapytanie [l,r] |
| M4 | Kodowanie Huffmana | Budowa drzewa krok po kroku, kody, kompresja |

Moduly M2 i M4 maja dodatkowo **piaskownice** (sandbox) — mozna klikac na mape (M2) lub wpisywac tekst (M4).

### Tryb 2: Gra — caly pajplajn na jednej mapie

Symulacja jednego dnia w krolestwie: M1→M2→M3→M4, wynik kazdego modulu przekazywany do nastepnego.

### Sterowanie

- **→ / Spacja** — nastepny krok
- **←** — krok wstecz
- Najedz na wezel SVG, by zobaczyc szczegoly (tooltip)

## Struktura plikow

```
wizualizacja-app/
  index.html       — punkt wejscia HTML
  package.json     — zaleznosci i skrypty
  vite.config.js   — konfiguracja Vite
  src/
    main.jsx       — renderowanie React
    App.jsx         — cala aplikacja (wizualizacja + gra)
```

Cala aplikacja jest w jednym pliku `App.jsx` — celowo, dla latwosci przegladu przez prowadzacego.