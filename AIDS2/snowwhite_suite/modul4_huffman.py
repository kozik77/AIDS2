# M4 cz.1: kroniki zajmują dużo miejsca -> kompresja Huffmana
# częste znaki = krótkie kody, rzadkie = długie
# budowa drzewa: heap, łączymy dwa najrzadsze -> nowy węzeł
# złożoność budowy: O(n log n), kompresja O(m), dekompresja O(m)

import heapq
from dataclasses import dataclass
from typing import Dict, Optional
from collections import Counter

@dataclass
class WezelHuffmana:
    znak: Optional[str]
    czestosc: int
    lewy: Optional['WezelHuffmana'] = None
    prawy: Optional['WezelHuffmana'] = None

class KoderHuffmana:
    def __init__(self) -> None:
        self.kody: Dict[str, str] = {}
        self.korzen: Optional[WezelHuffmana] = None

    def buduj_drzewo(self, tekst: str) -> None:
        if not tekst:
            return

        czestosci = Counter(tekst)
        
        # tylko jeden znak - nie da się zbudować normalnego drzewa, dajemy kod "0"
        if len(czestosci) == 1:
            znak = list(czestosci.keys())[0]
            self.korzen = WezelHuffmana(znak=znak, czestosc=czestosci[znak])
            self.kody = {znak: "0"}
            return

        kopiec = []
        licznik = 0  # żeby heapq nie porównywał WezelHuffmana (TypeError)

        for znak, czestosc in czestosci.items():
            w = WezelHuffmana(znak=znak, czestosc=czestosc)
            heapq.heappush(kopiec, (czestosc, licznik, w))
            licznik += 1

        # łączymy dwa najrzadsze węzły aż zostanie jeden (korzeń)
        while len(kopiec) > 1:
            czest1, _, lewy = heapq.heappop(kopiec)
            czest2, _, prawy = heapq.heappop(kopiec)

            nowy_wezel = WezelHuffmana(
                znak=None, 
                czestosc=czest1 + czest2,
                lewy=lewy,
                prawy=prawy
            )
            
            heapq.heappush(kopiec, (czest1 + czest2, licznik, nowy_wezel))
            licznik += 1

        _, _, self.korzen = heapq.heappop(kopiec)
        self._generuj_kody_rekurencja(self.korzen, "")

    def _generuj_kody_rekurencja(self, wezel: Optional[WezelHuffmana], aktualny_kod: str) -> None:
        # lewy=0, prawy=1, na liściu zapisujemy kod znaku
        if wezel is None:
            return
        
        if wezel.znak is not None:
            self.kody[wezel.znak] = aktualny_kod
            return
        
        self._generuj_kody_rekurencja(wezel.lewy, aktualny_kod + "0")
        self._generuj_kody_rekurencja(wezel.prawy, aktualny_kod + "1")

    def kompresuj(self, tekst: str) -> str:
        # rebuild drzewa za każdym razem (inny tekst = inne kody)
        if not tekst:
            return ""
        self.kody = {}
        self.korzen = None
        self.buduj_drzewo(tekst)
        return "".join(self.kody[znak] for znak in tekst)

    def dekompresuj(self, skompresowany_tekst: str) -> str:
        if not skompresowany_tekst or self.korzen is None:
            return ""
            
        # jeden znak - każdy bit to ten znak
        if self.korzen.lewy is None and self.korzen.prawy is None:
            return self.korzen.znak * len(skompresowany_tekst)

        # schodzimy po drzewie: 0=lewy, 1=prawy, jak liść to znak
        odkodowany = []
        aktualny = self.korzen
        
        for bit in skompresowany_tekst:
            aktualny = aktualny.lewy if bit == "0" else aktualny.prawy
                
            if aktualny.znak is not None:
                odkodowany.append(aktualny.znak)
                aktualny = self.korzen
                
        return "".join(odkodowany)