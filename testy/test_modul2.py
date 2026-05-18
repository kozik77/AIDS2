import pytest
from snowwhite_suite.modul2_hull import OtoczkaWypukla
from snowwhite_suite.modele import Punkt

def test_minimalna_liczba_punktow() -> None:
    algo = OtoczkaWypukla()
    p1 = Punkt(0, 0)
    p2 = Punkt(1, 1)
    otoczka = algo.buduj([p1, p2])
    assert len(otoczka) == 2
    assert algo.oblicz_obwod(otoczka) == pytest.approx(2.8284, rel=1e-3)

def test_kwadrat() -> None:
    algo = OtoczkaWypukla()
    punkty = [Punkt(0,0), Punkt(2,0), Punkt(2,2), Punkt(0,2), Punkt(1,1)]
    otoczka = algo.buduj(punkty)
    # Punkt (1,1) powinien zostać pominięty, bo jest wewnątrz
    assert len(otoczka) == 4
    assert algo.oblicz_obwod(otoczka) == 8.0

def test_punkty_wspolliniowe() -> None:
    algo = OtoczkaWypukla()
    # Trzy punkty na jednej linii, algorytm powinien wziąć tylko skrajne
    punkty = [Punkt(0,0), Punkt(1,0), Punkt(2,0), Punkt(1,1)]
    otoczka = algo.buduj(punkty)
    assert len(otoczka) == 3 # (0,0), (2,0), (1,1)