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
        
        # Przypadek brzegowy z dokumentacji: jeden unikalny znak
        if len(czestosci) == 1:
            znak = list(czestosci.keys())[0]
            self.korzen = WezelHuffmana(znak=znak, czestosc=czestosci[znak])
            self.kody = {znak: "0"}
            return

        kopiec = []
        # Tie-breaker rozwiązujący problem TypeError przy równych częstościach
        licznik = 0  

        for znak, czestosc in czestosci.items():
            w = WezelHuffmana(znak=znak, czestosc=czestosc)
            heapq.heappush(kopiec, (czestosc, licznik, w))
            licznik += 1

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
        if wezel is None:
            return
        
        if wezel.znak is not None:
            self.kody[wezel.znak] = aktualny_kod
            return
        
        self._generuj_kody_rekurencja(wezel.lewy, aktualny_kod + "0")
        self._generuj_kody_rekurencja(wezel.prawy, aktualny_kod + "1")

    def kompresuj(self, tekst: str) -> str:
        if not tekst:
            return ""
        if not self.kody:
            self.buduj_drzewo(tekst)
        return "".join(self.kody[znak] for znak in tekst)

    def dekompresuj(self, skompresowany_tekst: str) -> str:
        if not skompresowany_tekst or self.korzen is None:
            return ""
            
        # Obsługa przypadku z jednym unikalnym znakiem
        if self.korzen.lewy is None and self.korzen.prawy is None:
            return self.korzen.znak * len(skompresowany_tekst)

        odkodowany = []
        aktualny = self.korzen
        
        for bit in skompresowany_tekst:
            if bit == "0":
                aktualny = aktualny.lewy
            else:
                aktualny = aktualny.prawy
                
            if aktualny.znak is not None:
                odkodowany.append(aktualny.znak)
                aktualny = self.korzen
                
        return "".join(odkodowany)