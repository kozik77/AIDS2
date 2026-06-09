"""
Reprezentacja grafow i digrafow wazonych w trzech postaciach:
  1. Macierz sasiedztwa
  2.Lista sasiedztwa
  3. Dwie tablice (krawedzie + wagi)

Wejscie:
  Pierwszy wiersz: n m (liczba wierzcholkow, liczba krawedzi)
  Kolejne m wierszy: u v w (wierzcholek z, wierzcholek do, waga)

Flaga --directed na koncu tworzy digraf, bez niej — graf nieskierowany.
"""

import sys


def wczytaj_graf():
    """Wczytuje dane ze standardowego wejscia i zwraca (n, krawedzie, directed)."""
    dane = sys.stdin.read().strip().split('\n')
    if not dane:
        return 0, [], False

    # sprawdzamy czy ostatni element to flaga --directed
    directed = False
    ostatni = dane[-1].strip()
    if ostatni == '--directed':
        directed = True
        dane = dane[:-1]

    pierwszy = dane[0].split()
    n = int(pierwszy[0])
    m = int(pierwszy[1])

    krawedzie = []
    for i in range(1, m + 1):
        czesc = dane[i].split()
        u, v, w = int(czesc[0]), int(czesc[1]), float(czesc[2]) if '.' in czesc[2] else int(czesc[2])
        krawedzie.append((u, v, w))

    return n, krawedzie, directed


# ─── 1. MACIERZ SASIEDZTWA ───

def buduj_macierz_sasiedztwa(n, krawedzie, directed):
    """Macierz n×n, M[u][v] = waga krawedzi (0 jesli brak)."""
    M = [[0] * n for _ in range(n)]
    for u, v, w in krawedzie:
        M[u][v] = w
        if not directed:
            M[v][u] = w
    return M


def wyswietl_macierz_sasiedztwa(M):
    n = len(M)
    szer = 4  # szerokosc kolumny
    naglowek = " " * szer + "".join(f"{i:>{szer}}" for i in range(n))
    print(naglowek)
    for i in range(n):
        wiersz = f"{i:>{szer}}" + "".join(f"{M[i][j]:>{szer}}" for j in range(n))
        print(wiersz)


# ─── 2. LISTA SASIEDZTWA ───

def buduj_liste_sasiedztwa(n, krawedzie, directed):
    """Lista sasiedztwa: L[u] = [(v, waga), ...]"""
    L = [[] for _ in range(n)]
    for u, v, w in krawedzie:
        L[u].append((v, w))
        if not directed:
            L[v].append((u, w))
    return L


def wyswietl_liste_sasiedztwa(L):
    for u in range(len(L)):
        sasiady = ", ".join(f"({v}, {w})" for v, w in L[u])
        print(f"  {u}: [{sasiady}]")


# ─── 3. DWIE TABLICE ───

def buduj_dwie_tablice(n, krawedzie, directed):
    """
    Tablica E: krawedzie jako pary (u, v)
    Tablica W: odpowiadajace im wagi
    Indeks i w obu tablicach odpowiada tej samej krawedzi.
    """
    E = []
    W = []
    for u, v, w in krawedzie:
        E.append((u, v))
        W.append(w)
        if not directed:
            E.append((v, u))
            W.append(w)
    return E, W


def wyswietl_dwie_tablice(E, W):
    print("  Indeks | Krawedz (u,v) | Waga")
    print("  -------+----------------+-----")
    for i in range(len(E)):
        print(f"  {i:>5}  |   ({E[i][0]}, {E[i][1]})       | {W[i]}")


# ─── MAIN ───

if __name__ == "__main__":
    n, krawedzie, directed = wczytaj_graf()

    typ = "digraf wazony" if directed else "graf wazony"
    print(f"=== {typ}: {n} wierzcholkow, {len(krawedzie)} krawedzi ===\n")

    print("--- 1. Macierz sasiedztwa ---")
    M = buduj_macierz_sasiedztwa(n, krawedzie, directed)
    wyswietl_macierz_sasiedztwa(M)

    print("\n--- 2. Lista sasiedztwa ---")
    L = buduj_liste_sasiedztwa(n, krawedzie, directed)
    wyswietl_liste_sasiedztwa(L)

    print("\n--- 3. Dwie tablice (krawedzie + wagi) ---")
    E, W = buduj_dwie_tablice(n, krawedzie, directed)
    wyswietl_dwie_tablice(E, W)