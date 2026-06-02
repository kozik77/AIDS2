# Testy modułu 2 - otoczka wypukła

import pytest
from snowwhite_suite.modul2_hull import OtoczkaWypukla
from snowwhite_suite.modele import Punkt

def test_minimalna_liczba_punktow() -> None:
    algo = OtoczkaWypukla()
    otoczka = algo.buduj([Punkt(0, 0), Punkt(1, 1)])
    assert len(otoczka) == 2
    assert algo.oblicz_obwod(otoczka) == pytest.approx(2.8284, rel=1e-3)

def test_kwadrat() -> None:
    # punkt (1,1) wewnątrz - nie powinien być na otoczce
    algo = OtoczkaWypukla()
    punkty = [Punkt(0,0), Punkt(2,0), Punkt(2,2), Punkt(0,2), Punkt(1,1)]
    otoczka = algo.buduj(punkty)
    assert len(otoczka) == 4
    assert algo.oblicz_obwod(otoczka) == 8.0

def test_punkty_wspolliniowe() -> None:
    # na linii bierzemy tylko skrajne
    algo = OtoczkaWypukla()
    punkty = [Punkt(0,0), Punkt(1,0), Punkt(2,0), Punkt(1,1)]
    otoczka = algo.buduj(punkty)
    assert len(otoczka) == 3