# generator.py - stresowe testy dla wszystkich modulow
# uruchomienie: python testy/generator.py

import random
import time
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from snowwhite_suite.modul1_mcmf import SiecPrzeplywowa
from snowwhite_suite.modul2_hull import OtoczkaWypukla
from snowwhite_suite.modul3_rmq import DrzewoPrzedzialowe
from snowwhite_suite.modul4_huffman import KoderHuffmana
from snowwhite_suite.modul4_trie import DrzewoTrie
from snowwhite_suite.modele import Punkt


def generuj_losowy_tekst(dlugosc):
    znaki = "abcdefghijklmnopqrstuvwxyzącęłńóśźż "
    return "".join(random.choice(znaki) for _ in range(dlugosc))


def stres_mcmf():
    print("=== STRES: MCMF ===")
    random.seed(42)
    czasy = []

    for n_krasnali in [10, 50, 100, 200]:
        n_kopalni = n_krasnali // 2
        n_wezlow = n_krasnali + n_kopalni + 2
        zrodlo = 0
        ujscie = n_wezlow - 1

        siec = SiecPrzeplywowa(n_wezlow)
        for i in range(n_krasnali):
            siec.dodaj_krawedz(zrodlo, i + 1, 1, 0)
        for i in range(n_krasnali):
            for j in range(n_kopalni):
                koszt = random.randint(1, 100)
                siec.dodaj_krawedz(i + 1, n_krasnali + j + 1, 1, koszt)
        for j in range(n_kopalni):
            pojemnosc = random.randint(1, n_krasnali // n_kopalni + 2)
            siec.dodaj_krawedz(n_krasnali + j + 1, ujscie, pojemnosc, 0)

        start = time.time()
        p, k = siec.oblicz_mcmf(zrodlo, ujscie, n_krasnali)
        elapsed = time.time() - start
        czasy.append(elapsed)
        print(f"  n={n_krasnali} krasnali, {n_kopalni} kopalni: przeplyw={p}, czas={elapsed:.4f}s")

    print(f"  Max czas: {max(czasy):.4f}s\n")


def stres_otoczka():
    print("=== STRES: Otoczka wypukla ===")
    random.seed(42)
    czasy = []

    for n in [100, 1000, 5000, 10000]:
        punkty = [Punkt(random.uniform(-100, 100), random.uniform(-100, 100)) for _ in range(n)]
        algo = OtoczkaWypukla()

        start = time.time()
        otoczka = algo.buduj(punkty)
        obwod = algo.oblicz_obwod(otoczka)
        elapsed = time.time() - start
        czasy.append(elapsed)
        print(f"  n={n}: punktow na otoczce={len(otoczka)}, obwod={obwod:.2f}, czas={elapsed:.4f}s")

    print(f"  Max czas: {max(czasy):.4f}s\n")


def stres_rmq():
    print("=== STRES: RMQ (drzewo przedzialowe) ===")
    random.seed(42)
    czasy = []

    for n in [100, 1000, 10000, 100000]:
        glosnosci = [random.randint(1, 1000) for _ in range(n)]
        drzewo = DrzewoPrzedzialowe(glosnosci)

        start = time.time()
        for _ in range(10000):
            l = random.randint(0, max(n - 1, 0))
            r = random.randint(l, max(n - 1, 0))
            drzewo.zapytaj_maks(l, r)
        elapsed = time.time() - start
        czasy.append(elapsed)
        print(f"  n={n}: 10000 zapytan w {elapsed:.4f}s")

    print(f"  Max czas: {max(czasy):.4f}s\n")


def stres_huffman():
    print("=== STRES: Kodowanie Huffmana ===")
    random.seed(42)
    czasy = []

    for dlugosc in [100, 1000, 10000, 50000]:
        tekst = generuj_losowy_tekst(dlugosc)
        koder = KoderHuffmana()

        start = time.time()
        skomp = koder.kompresuj(tekst)
        dekomp = koder.dekompresuj(skomp)
        elapsed = time.time() - start
        czasy.append(elapsed)

        assert dekomp == tekst, f"Roundtrip nie przeszedl dla dlugosc={dlugosc}"
        ratio = len(skomp) / max(dlugosc * 8, 1) * 100
        print(f"  dlugosc={dlugosc}: skompresowano do {ratio:.1f}% oryginalu, czas={elapsed:.4f}s")

    print(f"  Max czas: {max(czasy):.4f}s\n")


def stres_trie():
    print("=== STRES: Drzewo Trie ===")
    random.seed(42)
    czasy = []

    for n_slow in [100, 1000, 5000, 10000]:
        slowa = [generuj_losowy_tekst(random.randint(3, 15)).strip() for _ in range(n_slow)]
        trie = DrzewoTrie()

        start = time.time()
        for s in slowa:
            trie.wstaw(s)
        for _ in range(5000):
            s = random.choice(slowa)
            assert trie.szukaj(s), f"Nie znaleziono slowa"
        elapsed = time.time() - start
        czasy.append(elapsed)
        print(f"  n={n_slow} slow: wstawianie + 5000 szukan w {elapsed:.4f}s")

    print(f"  Max czas: {max(czasy):.4f}s\n")


if __name__ == "__main__":
    print("STRESOWE TESTY - Krolestwo Krasnolkow\n")
    stres_mcmf()
    stres_otoczka()
    stres_rmq()
    stres_huffman()
    stres_trie()
    print("=== WSZYSTKIE STRESOWE TESTY ZAKONCZONE ===")