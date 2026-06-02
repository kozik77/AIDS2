# M1: każdy krasnal -> kopalnia, koszt = odległość, chcemy max przepływ (wszyscy pracują) przy min koszcie
# algorytm: MCMF z SPFA (Shortest Path Faster Algorithm) do szukania najtańszych ścieżek
# złożoność: O(F · V · E) — SPFA w najgorszym przypadku O(V·E), F iteracji pętli
# (uwaga: to jest prostsza implementacja niż SSP z potencjałami Johnsona+Dijkstra O(F·(E+V·logV)))

import math
from typing import List, Tuple
from collections import deque

class Krawedz:
    def __init__(self, do: int, przepustowosc: int, koszt: float, odwrotna: int):
        self.do = do
        self.przepustowosc = przepustowosc
        self.koszt = koszt
        self.przeplyw = 0                      # do śledzenia ile przeszło
        self.odwrotna = odwrotna               # żeby szybko znaleźć krawędź powrotną

class SiecPrzeplywowa:
    def __init__(self, liczba_wezlow: int):
        self.n = liczba_wezlow
        self.graf: List[List[Krawedz]] = [[] for _ in range(self.n)]

    def dodaj_krawedz(self, z: int, do: int, przepustowosc: int, koszt: float) -> None:
        # każda krawędź ma swoją odwrotną (residualną) z ujemnym kosztem
        krawedz_przod = Krawedz(do, przepustowosc, koszt, len(self.graf[do]))
        krawedz_tyl = Krawedz(z, 0, -koszt, len(self.graf[z]))
        
        self.graf[z].append(krawedz_przod)
        self.graf[do].append(krawedz_tyl)

    def szukaj_najtanszej_sciezki(self, zrodlo: int, ujscie: int) -> Tuple[bool, List[int], List[int]]:
        # SPFA - jak BFS ale z wagami, relaksujemy tylko sąsiadów akik mogą poprawić dystans
        odleglosci = [math.inf] * self.n
        rodzice_wezly = [-1] * self.n
        rodzice_krawedzie = [-1] * self.n
        w_kolejce = [False] * self.n
        
        odleglosci[zrodlo] = 0.0
        kolejka = deque([zrodlo])
        w_kolejce[zrodlo] = True
        
        while kolejka:
            u = kolejka.popleft()
            w_kolejce[u] = False
            
            for i, krawedz in enumerate(self.graf[u]):
                v = krawedz.do
                # sprawdzamy czy jest wolne miejsce (residual) i czy to krótsza droga
                if krawedz.przepustowosc - krawedz.przeplyw > 0 and odleglosci[v] > odleglosci[u] + krawedz.koszt:
                    odleglosci[v] = odleglosci[u] + krawedz.koszt
                    rodzice_wezly[v] = u
                    rodzice_krawedzie[v] = i
                    
                    if not w_kolejce[v]:
                        kolejka.append(v)
                        w_kolejce[v] = True
                        
        return odleglosci[ujscie] != math.inf, rodzice_wezly, rodzice_krawedzie

    def oblicz_mcmf(self, zrodlo: int, ujscie: int, wymagany_przeplyw: int) -> Tuple[int, float]:
        calkowity_przeplyw = 0
        calkowity_koszt = 0.0

        while calkowity_przeplyw < wymagany_przeplyw:
            znaleziono, rodzice_wezly, rodzice_krawedzie = self.szukaj_najtanszej_sciezki(zrodlo, ujscie)
            
            if not znaleziono:
                break

            # bottle-neck: ile max możemy przepchnąć po tej ścieżce
            przeplyw_sciezki = wymagany_przeplyw - calkowity_przeplyw
            aktualny = ujscie
            
            while aktualny != zrodlo:
                poprzedni = rodzice_wezly[aktualny]
                idx_krawedzi = rodzice_krawedzie[aktualny]
                krawedz = self.graf[poprzedni][idx_krawedzi]
                przeplyw_sciezki = min(przeplyw_sciezki, krawedz.przepustowosc - krawedz.przeplyw)
                aktualny = poprzedni

            # puszczamy przepływ i aktualizujemy sieć residualną
            aktualny = ujscie
            while aktualny != zrodlo:
                poprzedni = rodzice_wezly[aktualny]
                idx_krawedzi = rodzice_krawedzie[aktualny]
                
                krawedz_przod = self.graf[poprzedni][idx_krawedzi]
                krawedz_tyl = self.graf[aktualny][krawedz_przod.odwrotna]

                krawedz_przod.przeplyw += przeplyw_sciezki
                krawedz_tyl.przeplyw -= przeplyw_sciezki
                calkowity_koszt += przeplyw_sciezki * krawedz_przod.koszt
                
                aktualny = poprzedni

            calkowity_przeplyw += przeplyw_sciezki

        return calkowity_przeplyw, calkowity_koszt