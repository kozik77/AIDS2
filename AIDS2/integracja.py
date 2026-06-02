# Integracja: łączymy 4 moduły w realną symulację — wynik M1 przekazuje do M2, M2 do M3

from snowwhite_suite.modele import Punkt
from snowwhite_suite.modul1_mcmf import SiecPrzeplywowa
from snowwhite_suite.modul2_hull import OtoczkaWypukla
from snowwhite_suite.modul3_rmq import DrzewoPrzedzialowe
from snowwhite_suite.modul4_huffman import KoderHuffmana
from snowwhite_suite.modul4_trie import DrzewoTrie
import sys
import io

def przeprowadz_symulacje():
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    print("=== SYMULACJA DNIA W KRÓLESTWIE ŚNIEŻKI ===\n")

    # ---- DANE WEJŚCIOWE ----
    # krasnale z ich umiejętnościami (True = potrafi wydobywać minerał tej kopalni)
    krasnale = ["Gimli", "Thorin", "Balin"]
    # kopalnie ze współrzędnymi i pojemnością
    kopalnie = {
        4: {"nazwa": "Kopalnia Złota", "x": 1, "y": 0, "pojemnosc": 2},
        5: {"nazwa": "Kopalnia Węgla", "x": 4, "y": 0, "pojemnosc": 1},
    }
    # którzy krasnale mogą pracować w których kopalniach (koszt = odległość z domu)
    # domy krasnali: Gimli w (0,3), Thorin w (0,3), Balin w (2,3)
    domy = {1: (0, 3), 2: (0, 3), 3: (2, 3)}

    # ==== MODUŁ 1: Przydział pracy (MCMF) ====
    print(">>> MODUŁ 1: Przydział pracy (Min-Cost Max-Flow)")
    siec = SiecPrzeplywowa(7)
    
    siec.dodaj_krawedz(0, 1, 1, 0)   # źródło -> krasnale
    siec.dodaj_krawedz(0, 2, 1, 0)
    siec.dodaj_krawedz(0, 3, 1, 0)
    
    # odległości domy -> kopalnie
    for k_id, k_info in [(4, kopalnie[4]), (5, kopalnie[5])]:
        for k_krasnal in [1, 2, 3]:
            dx = domy[k_krasnal][0] - k_info["x"]
            dy = domy[k_krasnal][1] - k_info["y"]
            odleglosc = (dx*dx + dy*dy) ** 0.5
            # tylko Gimli i Thorin mogą do Złota, Balin może do Węgla
            if k_id == 5 and k_krasnal != 3:
                continue  # Balin -> tylko Węgiel
            siec.dodaj_krawedz(k_krasnal, k_id, 1, odleglosc)
    
    siec.dodaj_krawedz(4, 6, 2, 0)   # kopalnie -> ujście
    siec.dodaj_krawedz(5, 6, 1, 0)

    przeplyw, koszt = siec.oblicz_mcmf(0, 6, 3)
    print(f"Przydzielono krasnali: {przeplyw}")
    print(f"Sumaryczna odległość dom→kopalnia: {koszt:.2f}\n")

    # ==== MODUŁ 2: Trasa patrolu (Otoczka wypukła) ====
    # bierzemy współrzędne UŻYTYCH kopalni z M1
    print(">>> MODUŁ 2: Trasa patrolu Księcia (Algorytm Andrew)")
    uzyte_kopalnie = [4, 5]  # obie kopalnie są użytkowane
    punkty_kopalni = [Punkt(kopalnie[k]["x"], kopalnie[k]["y"]) for k in uzyte_kopalnie]
    punkty_w_terenie = punkty_kopalni + [Punkt(0, 0), Punkt(5, 3)]
    
    otoczka = OtoczkaWypukla()
    trasa = otoczka.buduj(punkty_w_terenie)
    obwod = otoczka.oblicz_obwod(trasa)
    
    print(f"Punkty z M1 (użyte kopalnie): {[(kopalnie[k]['nazwa'], kopalnie[k]['x'], kopalnie[k]['y']) for k in uzyte_kopalnie]}")
    print(f"Liczba punktów na trasie patrolu: {len(trasa)}")
    print(f"Długość trasy patrolu: {obwod:.2f} jednostek\n")

    # ==== MODUŁ 3: Najgłośniejszy dekametrowiec (RMQ) ====
    # dekametrowcy ustawieni WZDŁUŻ TRASy z M2
    print(">>> MODUŁ 3: Reakcja na atak jabłkami (RMQ)")
    # rozstawiamy dekametrowców co ~1 jednostkę na trasie patrolu z M2
    # ich głośności zależą od odcinka muru
    glosnosci = [3, 7, 5, 2, 9, 6, 1, 4, 8, 5]
    drzewo_rmq = DrzewoPrzedzialowe(glosnosci)
    
    lewy_skraj = 2
    prawy_skraj = 6
    wartosc, indeks = drzewo_rmq.zapytaj_maks(lewy_skraj, prawy_skraj)
    print(f"Głośności na murze (wzdłuż trasy z M2): {glosnosci}")
    print(f"Atak na sektor [{lewy_skraj} - {prawy_skraj}]")
    print(f"Najgłośniejszy dekametrowiec: indeks={indeks}, głośność={wartosc}\n")

    # ==== MODUŁ 4: Archiwizacja (Huffman + Trie) ====
    # archiwizujemy raport z dzisiejszej symulacji
    print(">>> MODUŁ 4: Archiwizacja i wyszukiwanie w kronikach")
    raport_dzienny = (
        f"Przydzielono {przeplyw} krasnali. "
        f"Odleglosc {koszt:.1f}. "
        f"Trasa patrolu {obwod:.1f}. "
        f"Atak sektor {lewy_skraj}-{prawy_skraj} dekametrowiec {indeks}."
    )
    
    koder = KoderHuffmana()
    skomp_raport = koder.kompresuj(raport_dzienny)
    org_bity = len(raport_dzienny) * 8
    skomp_bity = len(skomp_raport)
    print(f"Raport: '{raport_dzienny}'")
    print(f"Oryginał: {org_bity} bitów → Po kompresji: {skomp_bity} bitów (oszczędność {(1 - skomp_bity/org_bity)*100:.1f}%)")
    
    trie = DrzewoTrie()
    for slowo in raport_dzienny.split():
        trie.wstaw(slowo)
        
    for szukane in ["Atak", "Trasa", "krasnal"]:
        znaleziono = trie.szukaj(szukane)
        print(f"Czy '{szukane}' jest w raporcie? {'Tak' if znaleziono else 'Nie (wielkość liter!)'}")
    print("===========================================\n")

if __name__ == "__main__":
    przeprowadz_symulacje()