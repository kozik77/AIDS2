# M3: na murze atak jabłek -> trzeba szybko znaleźć najgłośniejszego dekametrowca na odcinku [l,r]
# drzewo przedziałowe: budowa O(n), zapytanie O(log n)
# zwraca (indeks, wartość) — indeks zgodnie ze specyfikacją

import sys
from typing import List, Tuple

sys.setrecursionlimit(2000)

class DrzewoPrzedzialowe:
    # tablicowa reprezentacja: korzeń w 1, synowie 2i i 2i+1
    def __init__(self, glosnosci: List[int]) -> None:
        self.rozmiar = len(glosnosci)
        self._glosnosci = glosnosci[:]  # potrzebujemy do odzyskania indeksu
        if self.rozmiar == 0:
            self.wezly: List[Tuple[float, int]] = []
            return
            
        self.wezly = [(float('-inf'), -1)] * (4 * self.rozmiar)
        self._zbuduj(1, 0, self.rozmiar - 1)

    def _zbuduj(self, wezel: int, lewy: int, prawy: int) -> None:
        if lewy == prawy:
            # liść = konkretny dekametrowiec, indeks = lewy
            self.wezly[wezel] = (self._glosnosci[lewy], lewy)
        else:
            srodek = (lewy + prawy) // 2
            self._zbuduj(2 * wezel, lewy, srodek)
            self._zbuduj(2 * wezel + 1, srodek + 1, prawy)
            # węzeł = max z synów (najpierw wartość, potem indeks do tie-break)
            lewy_max = self.wezly[2 * wezel]
            prawy_max = self.wezly[2 * wezel + 1]
            self.wezly[wezel] = max(lewy_max, prawy_max, key=lambda x: (x[0], -x[1]))

    def zapytaj_maks(self, lewy: int, prawy: int) -> Tuple[float, int]:
        # zwraca (wartość, indeks) — indeks pozycji najgłośniejszego
        if lewy > prawy or self.rozmiar == 0:
            return (float('-inf'), -1)
        
        lewy = max(0, lewy)
        prawy = min(self.rozmiar - 1, prawy)
        
        if lewy > prawy:
            return (float('-inf'), -1)

        return self._zapytaj(1, 0, self.rozmiar - 1, lewy, prawy)

    def _zapytaj(self, wezel: int, start: int, koniec: int, lewy: int, prawy: int) -> Tuple[float, int]:
        # poza zakresem
        if lewy > koniec or prawy < start:
            return (float('-inf'), -1)
        
        # cały przedział węzła w zapytaniu
        if lewy <= start and koniec <= prawy:
            return self.wezly[wezel]
        
        # częściowe — bierzemy max z synów (lepszego z tie-break)
        srodek = (start + koniec) // 2
        lewy_wynik = self._zapytaj(2 * wezel, start, srodek, lewy, prawy)
        prawy_wynik = self._zapytaj(2 * wezel + 1, srodek + 1, koniec, lewy, prawy)
        if lewy_wynik[0] >= prawy_wynik[0]:
            return lewy_wynik
        else:
            return prawy_wynik