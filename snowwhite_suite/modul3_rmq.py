import sys
from typing import List

# Podnosimy limit rekurencji dla dużych tablic
sys.setrecursionlimit(2000)

class DrzewoPrzedzialowe:
    def __init__(self, glosnosci: List[int]) -> None:
        self.rozmiar = len(glosnosci)
        if self.rozmiar == 0:
            self.wezly: List[float] = []
            return
            
        self.wezly = [float('-inf')] * (4 * self.rozmiar)
        self._zbuduj(1, 0, self.rozmiar - 1, glosnosci)

    def _zbuduj(self, wezel: int, lewy: int, prawy: int, glosnosci: List[int]) -> None:
        if lewy == prawy:
            self.wezly[wezel] = glosnosci[lewy]
        else:
            srodek = (lewy + prawy) // 2
            lewy_syn = 2 * wezel
            prawy_syn = 2 * wezel + 1
            
            self._zbuduj(lewy_syn, lewy, srodek, glosnosci)
            self._zbuduj(prawy_syn, srodek + 1, prawy, glosnosci)
            
            self.wezly[wezel] = max(self.wezly[lewy_syn], self.wezly[prawy_syn])

    def zapytaj_maks(self, lewy: int, prawy: int) -> float:
        # Obsługa przypadków brzegowych
        if lewy > prawy or self.rozmiar == 0:
            return float('-inf')
        
        # Przycięcie zapytań wykraczających poza tablicę
        lewy = max(0, lewy)
        prawy = min(self.rozmiar - 1, prawy)
        
        if lewy > prawy:
            return float('-inf')

        return self._zapytaj(1, 0, self.rozmiar - 1, lewy, prawy)

    def _zapytaj(self, wezel: int, start: int, koniec: int, lewy: int, prawy: int) -> float:
        if lewy > koniec or prawy < start:
            return float('-inf')
        
        if lewy <= start and koniec <= prawy:
            return self.wezly[wezel]
        
        srodek = (start + koniec) // 2
        maks_lewy = self._zapytaj(2 * wezel, start, srodek, lewy, prawy)
        maks_prawy = self._zapytaj(2 * wezel + 1, srodek + 1, koniec, lewy, prawy)
        
        return max(maks_lewy, maks_prawy)