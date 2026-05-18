import pytest
from AIDS2.snowwhite_suite.modul3_rmq import DrzewoPrzedzialowe

def test_puste_drzewo() -> None:
    drzewo = DrzewoPrzedzialowe([])
    assert drzewo.zapytaj_maks(0, 5) == float('-inf')

def test_pojedynczy_element() -> None:
    drzewo = DrzewoPrzedzialowe([42])
    assert drzewo.zapytaj_maks(0, 0) == 42
    assert drzewo.zapytaj_maks(0, 5) == 42
    assert drzewo.zapytaj_maks(1, 5) == float('-inf')

@pytest.mark.parametrize(
    "glosnosci, zapytanie_l, zapytanie_r, oczekiwany_wynik",
    [
        ([1, 5, 2, 4, 3], 0, 4, 5),
        ([1, 5, 2, 4, 3], 2, 4, 4),
        ([1, 5, 2, 4, 3], 0, 1, 5),
        ([1, 5, 2, 4, 3], 2, 2, 2),
        ([1, 5, 2, 4, 3], 3, 1, float('-inf')), # lewy > prawy
        ([10, 20, 30, 40, 50, 60], 1, 3, 40),
    ]
)
def test_rozne_zapytania(glosnosci: list[int], zapytanie_l: int, zapytanie_r: int, oczekiwany_wynik: float) -> None:
    drzewo = DrzewoPrzedzialowe(glosnosci)
    assert drzewo.zapytaj_maks(zapytanie_l, zapytanie_r) == oczekiwany_wynik