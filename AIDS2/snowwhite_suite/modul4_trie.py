# M4 cz.2: szybkie wyszukiwanie w kronikach -> drzewo Trie
# wstawianie i szukanie O(k) gdzie k = długość słowa
# każdy węzeł = jedna litera, flaga czy_koniec_slowa = kompletne słowo

from typing import Dict

class WezelTrie:
    def __init__(self) -> None:
        self.dzieci: Dict[str, 'WezelTrie'] = {}
        self.czy_koniec_slowa: bool = False

class DrzewoTrie:
    def __init__(self) -> None:
        self.korzen = WezelTrie()

    def wstaw(self, slowo: str) -> None:
        aktualny = self.korzen
        for znak in slowo:
            if znak not in aktualny.dzieci:
                aktualny.dzieci[znak] = WezelTrie()
            aktualny = aktualny.dzieci[znak]
        aktualny.czy_koniec_slowa = True

    def szukaj(self, slowo: str) -> bool:
        # True tylko jak całe słowo było wstawione
        aktualny = self.korzen
        for znak in slowo:
            if znak not in aktualny.dzieci:
                return False
            aktualny = aktualny.dzieci[znak]
        return aktualny.czy_koniec_slowa
        
    def start_z_prefiksem(self, prefiks: str) -> bool:
        # czy jakiekolwiek słowo zaczyna się od tego prefiksu
        aktualny = self.korzen
        for znak in prefiks:
            if znak not in aktualny.dzieci:
                return False
            aktualny = aktualny.dzieci[znak]
        return True