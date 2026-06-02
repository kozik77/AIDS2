# Testy modułu 1 - MCMF

import pytest
from snowwhite_suite.modul1_mcmf import SiecPrzeplywowa


def test_prosty_przeplyw():
    # dwie ścieżki równej przepustowości, tańsza i droższa
    siec = SiecPrzeplywowa(4)
    siec.dodaj_krawedz(0, 1, 10, 1)
    siec.dodaj_krawedz(0, 2, 10, 2)
    siec.dodaj_krawedz(1, 3, 10, 1)
    siec.dodaj_krawedz(2, 3, 10, 1)
    przeplyw, koszt = siec.oblicz_mcmf(0, 3, 20)
    assert przeplyw == 20
    assert koszt == 50


def test_brak_sciezki():
    # nie da się dotrzeć z 0 do 2
    siec = SiecPrzeplywowa(3)
    siec.dodaj_krawedz(0, 1, 5, 1)
    przeplyw, koszt = siec.oblicz_mcmf(0, 2, 1)
    assert przeplyw == 0


def test_minimalny_koszt():
    # MCMF wybiera tańszą ścieżkę 0->2->3
    siec = SiecPrzeplywowa(4)
    siec.dodaj_krawedz(0, 1, 5, 2)
    siec.dodaj_krawedz(0, 2, 5, 1)
    siec.dodaj_krawedz(1, 3, 5, 1)
    siec.dodaj_krawedz(2, 3, 5, 1)
    przeplyw, koszt = siec.oblicz_mcmf(0, 3, 5)
    assert przeplyw == 5
    assert koszt == 10


def test_czesciowy_przeplyw():
    # wymagane 5, możliwe tylko 2
    siec = SiecPrzeplywowa(3)
    siec.dodaj_krawedz(0, 1, 2, 3)
    siec.dodaj_krawedz(1, 2, 2, 1)
    przeplyw, koszt = siec.oblicz_mcmf(0, 2, 5)
    assert przeplyw == 2
    assert koszt == 8


def test_scenariusz_z_integracji():
    # ten sam przykład co w integracja.py
    siec = SiecPrzeplywowa(7)
    siec.dodaj_krawedz(0, 1, 1, 0)
    siec.dodaj_krawedz(0, 2, 1, 0)
    siec.dodaj_krawedz(0, 3, 1, 0)
    siec.dodaj_krawedz(1, 4, 1, 10)
    siec.dodaj_krawedz(2, 4, 1, 20)
    siec.dodaj_krawedz(3, 5, 1, 15)
    siec.dodaj_krawedz(4, 6, 2, 0)
    siec.dodaj_krawedz(5, 6, 1, 0)
    przeplyw, koszt = siec.oblicz_mcmf(0, 6, 3)
    assert przeplyw == 3
    assert koszt == pytest.approx(45)