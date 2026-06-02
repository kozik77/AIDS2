# Raport przeprowadzonych testów

**Data:** 02.06.2026  
**Środowisko:** Python 3.12.7, Windows, pytest 9.0.3  
**Łącznie:** 26 testów jednostkowych + test integracyjny + stresowe testy

---

## 1. Testy jednostkowe — wynik

Uruchomienie: `python -m pytest testy/ -v`

```
testy/test_modul1.py::test_prosty_przeplyw PASSED                        [  3%]
testy/test_modul1.py::test_brak_sciezki PASSED                           [  7%]
testy/test_modul1.py::test_minimalny_koszt PASSED                        [ 11%]
testy/test_modul1.py::test_czesciowy_przeplyw PASSED                     [ 15%]
testy/test_modul1.py::test_scenariusz_z_integracji PASSED                [ 19%]
testy/test_modul2.py::test_minimalna_liczba_punktow PASSED               [ 23%]
testy/test_modul2.py::test_kwadrat PASSED                                [ 26%]
testy/test_modul2.py::test_punkty_wspolliniowe PASSED                    [ 30%]
testy/test_modul3.py::test_puste_drzewo PASSED                           [ 34%]
testy/test_modul3.py::test_pojedynczy_element PASSED                     [ 38%]
testy/test_modul3.py::test_pojedynczy_element_poza_zasiegiem PASSED      [ 42%]
testy/test_modul3.py::test_rozne_zapytania[0-4-5-1] PASSED               [ 46%]
testy/test_modul3.py::test_rozne_zapytania[2-4-4-3] PASSED               [ 50%]
testy/test_modul3.py::test_rozne_zapytania[0-1-5-1] PASSED               [ 53%]
testy/test_modul3.py::test_rozne_zapytania[2-2-2-2] PASSED               [ 57%]
testy/test_modul3.py::test_rozne_zapytania[3-1--inf--1] PASSED            [ 61%]
testy/test_modul3.py::test_rozne_zapytania[1-3-40-3] PASSED               [ 65%]
testy/test_modul4.py::test_pusty_tekst PASSED                            [ 69%]
testy/test_modul4.py::test_jeden_unikalny_znak PASSED                    [ 73%]
testy/test_modul4.py::test_polskie_znaki PASSED                          [ 76%]
testy/test_modul4.py::test_zwykly_tekst PASSED                           [ 80%]
testy/test_modul4.py::test_trie_wstaw_i_szukaj PASSED                    [ 84%]
testy/test_modul4.py::test_trie_pusta PASSED                             [ 88%]
testy/test_modul4.py::test_trie_prefiks_nie_jest_slowem PASSED           [ 92%]
testy/test_modul4.py::test_trie_start_z_prefiksem PASSED                 [ 96%]
testy/test_modul4.py::test_trie_polskie_znaki PASSED                     [100%]

26 passed in 0.05s
```

---

## 2. Szczegóły testów

### Moduł 1 — Min-Cost Max-Flow (5 testów)

| Test | Opis | Wejście | Oczekiwany wynik | Wynik |
|------|------|---------|-----------------|-------|
| test_prosty_przeplyw | Dwie ścieżki różnego kosztu | 4 węzły, przepływ 20 | przepływ=20, koszt=50 | PASSED |
| test_brak_sciezki | Brak ścieżki źródło→ujście | 3 węzły | przepływ=0 | PASSED |
| test_minimalny_koszt | Wybór tańszej ścieżki | Dwie ścieżki koszt 2 i 3 | przepływ=5, koszt=10 | PASSED |
| test_czesciowy_przeplyw | Wymagany > możliwy | Przepustowość 2, wymagany 5 | przepływ=2, koszt=8 | PASSED |
| test_scenariusz_z_integracji | Sieć z integracji | 7 węzłów, 3 krasnale, 2 kopalnie | przepływ=3, koszt≈45 | PASSED |

### Moduł 2 — Otoczka wypukła (3 testy)

| Test | Opis | Wejście | Oczekiwany wynik | Wynik |
|------|------|---------|-----------------|-------|
| test_minimalna_liczba_punktow | 2 punkty | (0,0), (1,1) | 2 punkty, obwód≈2.828 | PASSED |
| test_kwadrat | Kwadrat + punkt wewnątrz | 4 narożniki + (1,1) | 4 punkty, obwód=8 | PASSED |
| test_punkty_wspolliniowe | Punkty na linii + punkt nad | 3 na osi + (1,1) | 3 punkty | PASSED |

### Moduł 3 — Drzewo przedziałowe RMQ (8 testów)

`zapytaj_maks(l, r)` zwraca krotkę `(wartość, indeks)`.

| Test | Opis | Wejście | Zapytanie | Oczekiwany wynik | Wynik |
|------|------|---------|-----------|-----------------|-------|
| test_puste_drzewo | Pusta tablica | [] | (0,5) | (-inf, -1) | PASSED |
| test_pojedynczy_element | Jeden element | [42] | (0,0) | (42, 0) | PASSED |
| test_pojedynczy_el._poza | Poza zakresem | [42] | (1,5) | (-inf, -1) | PASSED |
| param. [0-4] | Cała tablica | [1,5,2,4,3] | (0,4) | (5, 1) | PASSED |
| param. [2-4] | Środek | [1,5,2,4,3] | (2,4) | (4, 3) | PASSED |
| param. [0-1] | Lewy skraj | [1,5,2,4,3] | (0,1) | (5, 1) | PASSED |
| param. [2-2] | Jeden element | [1,5,2,4,3] | (2,2) | (2, 2) | PASSED |
| param. [3-1] | Lewy > prawy | [1,5,2,4,3] | (3,1) | (-inf, -1) | PASSED |
| param. [1-3] | Rosnąca | [10,20,30,40,50,60] | (1,3) | (40, 3) | PASSED |

### Moduł 4 — Huffman (4 testy) + Trie (5 testów) = 9 testów

**Huffman:**

| Test | Opis | Wynik |
|------|------|-------|
| test_pusty_tekst | Kompresja pustego → "" | PASSED |
| test_jeden_unikalny_znak | "aaaaa" → "00000", roundtrip OK | PASSED |
| test_polskie_znaki | "Zażółć gęślą jaźń!" roundtrip | PASSED |
| test_zwykly_tekst | Kompresja < ASCII, roundtrip OK | PASSED |

**Trie:**

| Test | Opis | Wynik |
|------|------|-------|
| test_trie_wstaw_i_szukaj | Wstaw 3 słowa, szukaj wszystkie + nieistniejące | PASSED |
| test_trie_pusta | Puste trie → szukaj "cokolwiek" = False | PASSED |
| test_trie_prefiks_nie_jest_slowem | "atak" wstawione, szukaj "ata" = False | PASSED |
| test_trie_start_z_prefiksem | "atak", "atakujacy" → start_z_prefiksem("ata") = True | PASSED |
| test_trie_polskie_znaki | "żółć", "śląsk" wstawione i szukane | PASSED |

---

## 3. Test integracyjny

Uruchomienie: `python integracja.py`

Moduły przekazują wyniki: M1 → współrzędne kopalni → M2 → trasa patrolu → M3 → raport → M4.

```
=== SYMULACJA DNIA W KRÓLESTWIE ŚNIEŻKI ===

>>> MODUŁ 1: Przydział pracy (Min-Cost Max-Flow)
Przydzielono krasnali: 3
Sumaryczna odległość dom→kopalnia: 9.93

>>> MODUŁ 2: Trasa patrolu Księcia (Algorytm Andrew)
Punkty z M1 (użyte kopalnie): [('Kopalnia Złota', 1, 0), ('Kopalnia Węgla', 4, 0)]
Liczba punktów na trasie patrolu: 3
Długość trasy patrolu: 12.99 jednostek

>>> MODUŁ 3: Reakcja na atak jabłkami (RMQ)
Głośności na murze (wzdłuż trasy z M2): [3, 7, 5, 2, 9, 6, 1, 4, 8, 5]
Atak na sektor [2 - 6]
Najgłośniejszy dekametrowiec: indeks=4, głość=9

>>> MODUŁ 4: Archiwizacja i wyszukiwanie w kronikach
Raport: 'Przydzielono 3 krasnali. Odleglosc 9.9. Trasa patrolu 13.0. Atak sektor 2-6 dekametrowiec 4.'
Oryginał: 736 bitów → Po kompresji: 424 bitów (oszczędność 42.4%)
Czy 'Atak' jest w raporcie? Tak
Czy 'Trasa' jest w raporcie? Tak
Czy 'krasnal' jest w raporcie? Nie (wielkość liter!)
```

---

## 4. Stresowe testy

Uruchomienie: `python testy/generator.py`

### MCMF (SPFA)
| Rozmiar | Przepływ | Czas |
|---------|----------|------|
| 10 krasnali, 5 kopalni | 10 | 0.001s |
| 50 krasnali, 25 kopalni | 50 | 0.019s |
| 100 krasnali, 50 kopalni | 100 | 0.135s |
| 200 krasnali, 100 kopalni | 200 | 1.14s |

### Otoczka wypukła
| n | Punktów na otoczce | Czas |
|---|---------------------|------|
| 100 | 12 | <0.001s |
| 1 000 | 18 | 0.001s |
| 5 000 | 28 | 0.007s |
| 10 000 | 23 | 0.014s |

### RMQ — drzewo przedziałowe
| n | 10 000 zapytań | Czas |
|---|----------------|------|
| 100 | query(l,r) → (wartość, indeks) | 0.042s |
| 1 000 | | 0.084s |
| 10 000 | | 0.095s |
| 100 000 | | 0.122s |

### Huffman
| Długość tekstu | Kompresja (% oryginału) | Czas |
|----------------|------------------------|------|
| 100 | 59.6% | <0.001s |
| 1 000 | 63.9% | <0.001s |
| 10 000 | 64.4% | 0.005s |
| 50 000 | 64.5% | 0.018s |

### Trie
| n słów | Wstawienie + 5 000 szukań | Czas |
|--------|---------------------------|------|
| 100 | | 0.005s |
| 1 000 | | 0.009s |
| 5 000 | | 0.021s |
| 10 000 | | 0.063s |

---

## 5. Obserwacje z implementacji

1. **MCMF + SPFA** — dla 200 krasnali czas rośnie wyraźnie (1.1s), co potwierdza złożoność O(F·V·E). Dla typowych danych projektu (<50 węzłów) działa natychmiast. Implementacja używa SPFA (wariant Bellmana-Forda z kolejką), nie Johnson+Dijkstra — jest prostsza w kodzie ale słabsza asymptotycznie (O(F·V·E) vs O(F·(E+V·logV))).

2. **Otoczka wypukła** — O(n log n) potwierdzone praktycznie: 10 000 punktów w 14ms. Liczba punktów na otoczce rośnie wolniej niż n.

3. **Drzewo przedziałowe** — zapytania O(log n): 100k elementów, 10k zapytań w 0.12s. `zapytaj_maks` zwraca `(wartość, indeks)` — indeks najgłośniejszego dekametrowca, co jest zgodne ze specyfikacją problemu („znaleźć dekametrowca [...] który winien wydać rozkazy").

4. **Huffman** — kompresja osiąga ~60% oryginału dla losowego tekstu z polskimi znakami. Roundtrip bezbłędny. Przypadek brzegowy jednego znaku (kod "0") obsługiwany poprawnie.

5. **Trie** — O(k) na wstawianie/szukanie potwierdzone. Poprawnie rozróżnia prefiks od słowa („ata" ≠ słowo gdy wstawiono „atak"). Polskie znaki obsługiwane.

6. **Integracja M1→M2→M3→M4** — moduły przekazują dane: kopalnie z M1 stają się punktami dla M2, trasa z M2 definiuje rozmieszczenie dekametrowców w M3, a raport z M4 zawiera dane ze wszystkich modułów.