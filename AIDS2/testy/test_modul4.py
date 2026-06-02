# Testy modułu 4 - Huffman i Trie

import pytest
from snowwhite_suite.modul4_huffman import KoderHuffmana
from snowwhite_suite.modul4_trie import DrzewoTrie

# ---- Huffman ----

def test_pusty_tekst() -> None:
    koder = KoderHuffmana()
    assert koder.kompresuj("") == ""
    assert koder.dekompresuj("") == ""

def test_jeden_unikalny_znak() -> None:
    koder = KoderHuffmana()
    tekst = "aaaaa"
    skompresowany = koder.kompresuj(tekst)
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
    assert len(skompresowany) < len(tekst) * 8
    assert koder.dekompresuj(skompresowany) == tekst

# ---- Trie ----

def test_trie_wstaw_i_szukaj() -> None:
    trie = DrzewoTrie()
    trie.wstaw("atak")
    trie.wstaw("jablko")
    trie.wstaw("krasnoludek")
    assert trie.szukaj("atak") == True
    assert trie.szukaj("jablko") == True
    assert trie.szukaj("krasnoludek") == True
    assert trie.szukaj("nieistnieje") == False

def test_trie_pusta() -> None:
    trie = DrzewoTrie()
    assert trie.szukaj("cokolwiek") == False

def test_trie_prefiks_nie_jest_slowem() -> None:
    # "ata" jest prefiksem "atak" ale nie jest osobnym słowem
    trie = DrzewoTrie()
    trie.wstaw("atak")
    assert trie.szukaj("atak") == True
    assert trie.szukaj("ata") == False

def test_trie_start_z_prefiksem() -> None:
    trie = DrzewoTrie()
    trie.wstaw("atak")
    trie.wstaw("atakujacy")
    assert trie.start_z_prefiksem("ata") == True
    assert trie.start_z_prefiksem("xyz") == False

def test_trie_polskie_znaki() -> None:
    trie = DrzewoTrie()
    trie.wstaw("żółć")
    trie.wstaw("śląsk")
    assert trie.szukaj("żółć") == True
    assert trie.szukaj("śląsk") == True
    assert trie.szukaj("zolc") == False