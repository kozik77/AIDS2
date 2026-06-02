# Prezentacja Projektu — Królestwo Krasnoludków

---

## Slajd 1: Tytuł

**Algorytmy i Struktury Danych II — Projekt 2026**

Optymalizacja zarządzania Królestwem Krasnoludków

---

## Slajd 2: Problem — sformułowanie

Królewna Śnieżka i książę muszą rozwiązać **cztery problemy**:

1. **Przydział pracy** — każdy krasnal do kopalni, max wartość produkcji, min odległość
2. **Trasa patrolu** — książę okrąża kopalnie, chce najkrótszą trasę
3. **Obrona muru** — atak jabłek na odcinek → znaleźć najgłośniejszego dekametrowca
4. **Archiwizacja** — zapisywać kroniki oszczędnie i móc je szybko przeszukiwać

---

## Slajd 3: Problem 1 — Przydział krasnali do kopalni

- Każdy krasnal może pracować przy określonych minerałach
- Jeśli krasnal pracuje przy swoim minerale → stała wartość produkcji
- Książę mierzy odległości dom→kopalnia → sumaryczna odległość ma być min
- **Ale** wartość produkcji nie może spaść

**Formalizacja:** Min-Cost Max-Flow
- Źródło → krasnale (przepustowość 1, koszt 0)
- Krasnale → kopalnie (przepustowość 1, koszt = odległość)
- Kopalnie → ujście (przepustowość = liczba miejsc, koszt 0)
- Szukamy: max przepływ (wszyscy pracują) przy min koszcie (min odległość)

---

## Slajd 4: Algorytm MCMF — jak działa

1. Budujemy sieć przepływową z krawędziami residualnymi
2. Szukamy najtańszą ścieżkę powiększającą — **SPFA** (wariant Bellmana-Forda z kolejką)
3. Puszczamy po niej max przepływ (bottle-neck)
4. Aktualizujemy sieć residualną (krawędź przód + przepływ, krawędź tył − przepływ)
5. Powtarzamy aż przydzielimy wszystkich krasnali

**Złożoność:** O(F · V · E) gdzie F = wymagany przepływ, V = wierzchołki, E = krawędzie

---

## Slajd 5: Problem 2 — Trasa patrolu księcia

- Książę codziennie rano okrąża wszystkie użytkowane kopalnie
- Chce najkrótszą zamkniętą trasę
- Najkrótszy obwód otaczający wszystkie punkty = **obwód otoczki wypukłej**

**Dlaczego nie TSP?** — książę巡逻 po obwodzie, każdy punkt na obwodzie odwiedza dokładnie raz. To nie jest problem komiwojażera — szukamy otoczki.

---

## Slajd 6: Algorytm Andrew (Monotone Chain)

1. Sortujemy punkty leksykograficznie (po X, potem po Y) — O(n log n)
2. Budujemy **dolną pół-otoczkę**: idziemy L→R, usuwamy prawe skręty (iloczyn wektorowy ≤ 0)
3. Budujemy **górną pół-otoczkę**: idziemy R→L, analogicznie
4. Łączymy, ucinając powtarzający się punkt

**Złożoność:** O(n log n) — domina to sortowanie
**Pamięć:** O(n)

**Iloczyn wektorowy:** (a−o)×(b−o) = (ax−ox)(by−oy) − (ay−oy)(bx−ox)
- >0: lewy skręt, <0: prawy skręt, =0: współliniowe

---

## Slajd 7: Problem 3 — Najgłośniejszy dekametrowiec

- Mur obsadzony dekametrowcami, każdy ma swoją głośność
- Atak na odcinek [l, r] → trzeba szybko znaleźć max głośność na tym odcinku
- Zapytań może być dużo → liniowe O(n) za wolne

**Rozwiązanie:** Drzewo przedziałowe (Segment Tree) — Range Maximum Query

---

## Slajd 8: Drzewo przedziałowe — budowa i zapytania

**Budowa O(n):**
- Korzeń = max na całej tablicy [0, n−1]
- Lewy syn = max na [0, mid], prawy = max na [mid+1, n−1]
- Rekurencyjnie aż do liści (pojedyncze elementy)
- Tablicowa reprezentacja: korzeń w indeksie 1, synowie 2i, 2i+1

**Zapytanie O(log n):**
- Jeśli przedział węzła w całości w zapytaniu → zwróć wartość węzła
- Jeśli poza → -∞
- Częściowo → rekurencja do synów, max z wyników

**Pamięć:** O(n) — 4n węzłów w tablicy

---

## Slajd 9: Problem 4 — Archiwizacja kronik

Dwa podproblemy:

**4a. Oszczędzanie miejsca** — kodowanie Huffmana
- Częste znaki → krótkie kody, rzadkie → długie
- Drzewo: łączymy dwa najrzadsze węzły → nowy węzeł (suma częstości)
- Kod: lewy syn = 0, prawy = 1
- Kompresja: O(m), dekompresja: O(m), budowa: O(n log n)

**4b. Szybkie wyszukiwanie** — drzewo Trie
- Każde słowo = ścieżka od korzenia
- Wstawianie O(k), szukanie O(k) gdzie k = długość słowa
- Flaga czy_koniec_slowa — rozróżnia "app" od "apple"

---

## Slajd 10: Implementacja — struktura projektu

```
AIDS2/
├── snowwhite_suite/
│   ├── modele.py           — Punkt (x, y)
│   ├── modul1_mcmf.py      — SiecPrzeplywowa (MCMF)
│   ├── modul2_hull.py      — OtoczkaWypukla (Andrew)
│   ├── modul3_rmq.py       — DrzewoPrzedzialowe (RMQ)
│   ├── modul4_huffman.py   — KoderHuffmana
│   └── modul4_trie.py      — DrzewoTrie
├── testy/
│   ├── test_modul1.py      — 5 testów MCMF
│   ├── test_modul2.py      — 3 testy otoczki
│   ├── test_modul3.py      — 8 testów RMQ
│   └── test_modul4.py      — 4 testy Huffmana
├── integracja.py           — symulacja 4 modułów
├── wizualizacja.py         — mapa królestwa (matplotlib)
└── raporty/
    └── raport_testow.md    — wyniki testów
```

---

## Slajd 11: Wyniki testów

| Moduł | Testy | Wynik |
|-------|-------|-------|
| M1 — MCMF | 5 testów | ✅ wszystkie passed |
| M2 — Otoczka | 3 testy | ✅ wszystkie passed |
| M3 — RMQ | 8 testów | ✅ wszystkie passed |
| M4 — Huffman | 4 testy | ✅ wszystkie passed |
| **Razem** | **20 testów** | **20 passed** |

---

## Slajd 12: Demo — integracja

```
=== SYMULACJA DNIA W KRÓLESTWIE ŚNIEŻKI ===

>>> MODUŁ 1: Przydział pracy (Min-Cost Max-Flow)
Przydzielono krasnali: 3
Całkowity koszt energii (odległość): 45.0

>>> MODUŁ 2: Trasa patrolu Księcia (Algorytm Andrew)
Liczba punktów obronnych na trasie: 4
Długość trasy patrolu: 20.00 jednostek

>>> MODUŁ 3: Reakcja na atak jabłkami (RMQ)
Głośności na murze: [2, 8, 5, 1, 9, 4]
Atak na sektor [1 - 4]. Najgłośniejszy krasnal: 9

>>> MODUŁ 4: Archiwizacja i wyszukiwanie w kronikach
Oryginał: 256 bitów → Po kompresji: 126 bitów (50,8% oryginału)
Czy 'atak' jest w raporcie? Tak
```

---

## Slajd 13: Złożoność — podsumowanie

| Moduł | Algorytm | Czas | Pamięć |
|-------|----------|------|--------|
| M1 | MCMF (SPFA) | O(F·V·E) | O(V+E) |
| M2 | Andrew (otoczka) | O(n log n) | O(n) |
| M3 | Drzewo przedziałowe | budowa O(n), zapytanie O(log n) | O(n) |
| M4a | Huffman | O(n log n) budowa, O(m) kodowanie | O(n) |
| M4b | Trie | O(k) wstawianie/szukanie | O(Σk) |

---

## Slajd 14: Wnioski

1. **MCMF** — problem przydziału sprowadza się do sieci przepływowej; SPFA działa wystarczająco szybko
2. **Otoczka wypukła** — najkrótsza trasa patrolu = obwód otoczki, Andrew jest prostszy niż Graham
3. **Drzewo przedziałowe** — RMQ w O(log n) zamiast O(n), kluczowe przy wielu atakach
4. **Huffman + Trie** — kompresja zmniejsza rozmiar o ~50%, Trie pozwala szukać słowa w O(k)

Wszystkie moduły działają poprawnie i współpracują w symulacji integracyjnej.

---

## Slajd 15: Pytania?

Dziękujemy za uwagę!

Uruchomienie:
```
python integracja.py     # symulacja
python wizualizacja.py   # mapa z trasą
pytest testy/ -v         # testy
```