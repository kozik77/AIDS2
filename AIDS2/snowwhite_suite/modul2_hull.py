import math
from typing import List
from AIDS2.snowwhite_suite.modele import Punkt

class OtoczkaWypukla:
    @staticmethod
    def iloczyn_wektorowy(o: Punkt, a: Punkt, b: Punkt) -> float:
        """
        Oblicza znak iloczynu wektorowego wektorów OA i OB.
        Dodatni: lewy skręt, Ujemny: prawy skręt, 0: współliniowe.
        """
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)

    def buduj(self, punkty: List[Punkt]) -> List[Punkt]:
        n = len(punkty)
        if n <= 2:
            return sorted(punkty, key=lambda p: (p.x, p.y))

        # Sortowanie leksykograficzne (według X, potem Y)
        posortowane = sorted(punkty, key=lambda p: (p.x, p.y))

        # Budowa dolnej półotoczki
        dolna = []
        for p in posortowane:
            while len(dolna) >= 2 and self.iloczyn_wektorowy(dolna[-2], dolna[-1], p) <= 0:
                dolna.pop()
            dolna.append(p)

        # Budowa górnej półotoczki
        gorna = []
        for p in reversed(posortowane):
            while len(gorna) >= 2 and self.iloczyn_wektorowy(gorna[-2], gorna[-1], p) <= 0:
                gorna.pop()
            gorna.append(p)

        # Łączymy, usuwając ostatni punkt każdej listy (powtarza się)
        return dolna[:-1] + gorna[:-1]

    @staticmethod
    def oblicz_obwod(otoczka: List[Punkt]) -> float:
        if len(otoczka) < 2:
            return 0.0
        
        obwod = 0.0
        for i in range(len(otoczka)):
            p1 = otoczka[i]
            p2 = otoczka[(i + 1) % len(otoczka)]
            obwod += math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2)
        return obwod