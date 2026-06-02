# Testy modułu 3 - drzewo przedziałowe (RMQ)
# teraz zapytaj_maks zwraca (wartość, indeks)

import pytest
from snowwhite_suite.modul3_rmq import DrzewoPrzedzialowe

def test_puste_drzewo() -> None:
    drzewo = DrzewoPrzedzialowe([])
    wartosc, indeks = drzewo.zapytaj_maks(0, 5)
    assert wartosc == float('-inf')
    assert indeks == -1

def test_pojedynczy_element() -> None:
    drzewo = DrzewoPrzedzialowe([42])
    wartosc, indeks = drzewo.zapytaj_maks(0, 0)
    assert wartosc == 42
    assert indeks == 0

def test_pojedynczy_element_poza_zasiegiem() -> None:
    drzewo = DrzewoPrzedzialowe([42])
    wartosc, indeks = drzewo.zapytaj_maks(0, 5)
    assert wartosc == 42
    assert indeks == 0
    wartosc2, indeks2 = drzewo.zapytaj_maks(1, 5)
    assert wartosc2 == float('-inf')
    assert indeks2 == -1

@pytest.mark.parametrize(
    "glosnosci, zapytanie_l, zapytanie_r, oczekiwana_wartosc, oczekiwany_indeks",
    [
        ([1, 5, 2, 4, 3], 0, 4, 5, 1),      # max=5 na pozycji 1
        ([1, 5, 2, 4, 3], 2, 4, 4, 3),      # max=4 na pozycji 3
        ([1, 5, 2, 4, 3], 0, 1, 5, 1),      # max=5 na pozycji 1
        ([1, 5, 2, 4, 3], 2, 2, 2, 2),      # jeden element
        ([1, 5, 2, 4, 3], 3, 1, float('-inf'), -1),  # błędne zapytanie
        ([10, 20, 30, 40, 50, 60], 1, 3, 40, 3),     # max=40 na pozycji 3
    ]
)
def test_rozne_zapytania(glosnosci: list[int], zapytanie_l: int, zapytanie_r: int, oczekiwana_wartosc: float, oczekiwany_indeks: int) -> None:
    drzewo = DrzewoPrzedzialowe(glosnosci)
    wartosc, indeks = drzewo.zapytaj_maks(zapytanie_l, zapytanie_r)
    assert wartosc == oczekiwana_wartosc
    assert indeks == oczekiwany_indeks