import pytest
from AIDS2.snowwhite_suite.modul4_huffman import KoderHuffmana

def test_pusty_tekst() -> None:
    koder = KoderHuffmana()
    assert koder.kompresuj("") == ""
    assert koder.dekompresuj("") == ""

def test_jeden_unikalny_znak() -> None:
    koder = KoderHuffmana()
    tekst = "aaaaa"
    skompresowany = koder.kompresuj(tekst)
    # Zgodnie z dokumentacją: znak dostaje kod "0"
    assert skompresowany == "00000"
    assert koder.dekompresuj(skompresowany) == tekst

def test_polskie_znaki() -> None:
    koder = KoderHuffmana()
    tekst = "Zażółć gęślą jaźń!"
    skompresowany = koder.kompresuj(tekst)
    assert len(skompresowany) > 0
    assert koder.dekompresuj(skompresowany) == tekst

def test_zwykly_tekst() -> None:
    koder = KoderHuffmana()
    tekst = "krasnoludki kochaja owsianke"
    skompresowany = koder.kompresuj(tekst)
    # Upewniamy się, że zaszła kompresja 
    # (w ASCII ten tekst zajmowałby len(tekst) * 8 bitów)
    assert len(skompresowany) < len(tekst) * 8
    assert koder.dekompresuj(skompresowany) == tekst