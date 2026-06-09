"""
Algorytm Boyera-Moore'a (Boyer-Moore string matching algorithm)

Algorytm wyszukuje wzorzec w tekscie, porownujac znaki od PRAWEJ do LEWEJ.
Dzieki temu, przy niedopasowaniu, mozna przesunac wzorzec o wiecej niz jeden
znak naraz. Wykorzystuje dwie heurystyki:
  1. Heurystyka zlego znaku  (bad character rule)
  2. Heurystyka dobrego sufiksu (good suffix rule)
Rzeczywiste przesuniecie to maksimum z obu heurystyk.
"""

ROZMIAR_ALFABETU = 256  # liczba znakow w tablicy ASCII


def tablica_zlego_znaku(wzorzec):
    """
    Dla kazdego znaku zapamietuje indeks jego OSTATNIEGO wystapienia we wzorcu.
    Jesli znak nie wystepuje we wzorcu -> wartosc -1.
    """
    tablica = [-1] * ROZMIAR_ALFABETU
    for i in range(len(wzorzec)):
        tablica[ord(wzorzec[i])] = i
    return tablica


def tablica_dobrego_sufiksu(wzorzec):
    """
    Buduje tablice przesuniec dla heurystyki dobrego sufiksu.
    shift[i] - o ile przesunac wzorzec, gdy niedopasowanie nastapilo na
    pozycji i-1 (czyli dopasowany sufiks zaczyna sie od pozycji i we wzorcu).
    """
    m = len(wzorzec)
    shift = [0] * (m + 1)
    granica = [0] * (m + 1)  # tablica brzegow (borders)

    # --- Przypadek 1: dopasowany sufiks wystepuje gdzie indziej we wzorcu ---
    i = m
    j = m + 1
    granica[i] = j
    while i > 0:
        while j <= m and wzorzec[i - 1] != wzorzec[j - 1]:
            if shift[j] == 0:
                shift[j] = j - i
            j = granica[j]
        i -= 1
        j -= 1
        granica[i] = j

    # --- Przypadek 2: tylko czesc sufiksu pokrywa sie z prefiksem wzorca ---
    j = granica[0]
    for i in range(m + 1):
        if shift[i] == 0:
            shift[i] = j
        if i == j:
            j = granica[j]

    return shift


def boyer_moore(tekst, wzorzec):
    """
    Zwraca liste pozycji (indeksow), na ktorych wzorzec wystepuje w tekscie.
    """
    n = len(tekst)
    m = len(wzorzec)
    wyniki = []

    if m == 0 or m > n:
        return wyniki

    zly_znak = tablica_zlego_znaku(wzorzec)
    dobry_sufiks = tablica_dobrego_sufiksu(wzorzec)

    s = 0  # przesuniecie wzorca wzgledem poczatku tekstu
    while s <= n - m:
        j = m - 1

        # porownujemy znaki od prawej do lewej
        while j >= 0 and wzorzec[j] == tekst[s + j]:
            j -= 1

        if j < 0:
            # caly wzorzec sie zgadza -> znaleziono dopasowanie
            wyniki.append(s)
            s += dobry_sufiks[0]
        else:
            # niedopasowanie na pozycji j -> bierzemy wieksze z dwoch przesuniec
            przes_zly_znak = j - zly_znak[ord(tekst[s + j])]
            przes_sufiks = dobry_sufiks[j + 1]
            s += max(1, przes_zly_znak, przes_sufiks)

    return wyniki


if __name__ == "__main__":
    tekst = "AABAACAADAABAABA"
    wzorzec = "AABA"

    pozycje = boyer_moore(tekst, wzorzec)

    print("Tekst:  ", tekst)
    print("Wzorzec:", wzorzec)
    print()

    if pozycje:
        print("Wzorzec znaleziony na pozycjach:", pozycje)
        print()
        for p in pozycje:
            print("  " + tekst)
            print("  " + " " * p + wzorzec)
            print()
    else:
        print("Wzorzec nie zostal znaleziony.")