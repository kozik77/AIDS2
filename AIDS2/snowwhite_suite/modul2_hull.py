# M2: książę okrąża kopalnie - szukamy najkrótszej trasy = obwód otoczki wypukłej
# algorytm Andrew: sortujemy, budujemy dolną i górną pół-otoczkę, łączymy
# złożoność O(n log n) - domina to sortowanie

import math
from typing import List
from snowwhite_suite.modele import Punkt

class OtoczkaWypukla:
    @staticmethod
    def iloczyn_wektorowy(o: Punkt, a: Punkt, b: Punkt) -> float:
        # >0 lewy skręt, <0 prawy, =0 na linii
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)

    def buduj(self, punkty: List[Punkt]) -> List[Punkt]:
        n = len(punkty)
        if n <= 2:
            return sorted(punkty, key=lambda p: (p.x, p.y))

        posortowane = sorted(punkty, key=lambda p: (p.x, p.y))

        # dolna pół-otoczka - idziemy L→R, usuwamy prawe skręty
        dolna = []
        for p in posortowane:
            while len(dolna) >= 2 and self.iloczyn_wektorowy(dolna[-2], dolna[-1], p) <= 0:
                dolna.pop()
            dolna.append(p)

        # górna pół-otoczka - idziemy P→L, analogicznie
        gorna = []
        for p in reversed(posortowane):
            while len(gorna) >= 2 and self.iloczyn_wektorowy(gorna[-2], gorna[-1], p) <= 0:
                gorna.pop()
            gorna.append(p)

        # ostatni punkt każdej się powtarza więc go ucinamy
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