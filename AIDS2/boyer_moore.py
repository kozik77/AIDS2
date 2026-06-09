# Algorytm Boyera-Moore'a do wyszukiwania wzorca w tekście
#
# Idea: zamiast porównywać wzorzec znak po znaku od lewej,
# zaczynamy od prawego końca wzorca. Przy niezgodności (mismatch)
# przesuwamy wzorzec o tyle pozycji, ile wynika z dwóch heurystyk:
#
# 1. Heurystyka złego znaku (bad character rule):
#    Jeśli znak w tekście nie pasuje do znaku we wzorcu,
#    przesuwamy wzorzec tak, aby ten znak w tekście wyrównał się
#    z ostatnim wystąpieniem tego znaku we wzorcu.
#    Jeśli znaku nie ma we wzorcu — przesuwamy za niego całkowicie.
#
# 2. Heurystyka dobrego sufiksu (good suffix rule):
#    Jeśli dopasowaliśmy sufiks wzorca, a potem jest niezgodność,
#    przesuwamy wzorzec tak, aby wyrównać dopasowany sufiks
#    z następnym wystąpieniem tego sufiksu we wzorcu.
#
# Wybieramy większe przesunięcie z obu heurystyk.
# Złożoność: O(n/m) w najlepszym przypadku, O(n+m) w najgorszym.


def buduj_tabelę_złego_znaku(wzorzec: str) -> dict:
    # dla każdego znaku w wzorcu zapisujemy ostatnią pozycję (od prawej)
    # jeśli znak nie występuje — przesunięcie = długość wzorca
    tabela = {}
    for i in range(len(wzorzec) - 1):
        tabela[wzorzec[i]] = len(wzorzec) - 1 - i
    return tabela


def buduj_tabelę_dobrego_sufiksu(wzorzec: str) -> list:
    # dla każdej pozycji i obliczamy przesunięcie gdy
    # dopasowaliśmy wzorzec[i+1:] ale nie wzorzec[i]
    m = len(wzorzec)
    tabela = [0] * m

    # przypadek 1: dopasowany sufiks występuje gdzieś wcześniej we wzorcu
    for i in range(m - 1):
        # szukamy najkrótszego sufiksu wzorzec[i+1:]
        sufiks = wzorzec[i + 1:]
        # szukamy tego sufiksu we wzorcu (ale nie na pozycji i+1)
        for j in range(m - len(sufiks) - 1, -1, -1):
            if wzorzec[j:j + len(sufiks)] == sufiks:
                # znak przed sufiksem musi być inny niż wzorzec[i]
                if j == 0 or wzorzec[j - 1] != wzorzec[i]:
                    tabela[i] = m - j
                    break

    # przypadek 2: jeśli nigdzie — przesuwamy o całą długość,
    # chyba że prefiks wzorca pokrywa się z sufiksem dopasowanego fragmentu
    for i in range(m - 1):
        if tabela[i] == 0:
            sufiks = wzorzec[i + 1:]
            for k in range(len(sufiks), 0, -1):
                if sufiks[-k:] == wzorzec[:k]:
                    tabela[i] = m - k
                    break
            if tabela[i] == 0:
                tabela[i] = m

    tabela[m - 1] = 1
    return tabela


def boyer_moore(tekst: str, wzorzec: str) -> list[int]:
    # zwraca listę pozycji (0-indeksowanych) gdzie wzorzec występuje w tekście
    n = len(tekst)
    m = len(wzorzec)

    if m == 0 or m > n:
        return []

    zly_znak = buduj_tabelę_złego_znaku(wzorzec)
    dobry_sufiks = buduj_tabelę_dobrego_sufiksu(wzorzec)

    wyniki = []
    i = 0  # pozycja w tekście gdzie zaczynamy porównanie

    while i <= n - m:
        # porównujemy wzorzec z tekstem od prawej do lewej
        j = m - 1
        while j >= 0 and wzorzec[j] == tekst[i + j]:
            j -= 1

        if j < 0:
            # cały wzorzec dopasowany!
            wyniki.append(i)
            # przesuwamy o 1 żeby szukać dalej (mogli byśmy o dobry_sufiks ale 1 jest bezpieczne)
            i += 1
        else:
            # niezgodność na pozycji j
            # heurystyka złego znaku
            znak = tekst[i + j]
            przesuniecie_zly = zly_znak.get(znak, m)
            # ograniczamy przesunięcie żeby nie było mniejsze niż 1
            przesuniecie_zly = max(przesuniecie_zly - (m - 1 - j), 1)

            # heurystyka dobrego sufiksu
            przesuniecie_dobry = dobry_sufiks[j]

            # bierzemy większe przesunięcie
            i += max(przesuniecie_zly, przesuniecie_dobry)

    return wyniki


if __name__ == "__main__":
    # przykłady testowe
    przykłady = [
        ("ABAAABCABABABCABAB", "ABAB"),
        ("GCAATGCCTAATGCATGC", "AATGC"),
        ("krasnoludekkrasnoludki", "kras"),
        ("janjanjan", "jan"),
        ("ABCDEFG", "XYZ"),
        ("AAAAAA", "AA"),
    ]

    print("=== Algorytm Boyera-Moore'a — wyszukiwanie wzorca ===\n")

    for tekst, wzorzec in przykłady:
        pozycje = boyer_moore(tekst, wzorzec)
        if pozycje:
            print(f'  tekst:   "{tekst}"')
            print(f'  wzorzec: "{wzorzec}"')
            print(f'  znaleziono na pozycjach: {pozycje}')
            # wizualizacja
            for p in pozycje:
                linia = " " * p + wzorzec
                print(f'           {linia}')
            print()
        else:
            print(f'  tekst:   "{tekst}"')
            print(f'  wzorzec: "{wzorzec}"')
            print(f'  nie znaleziono\n')