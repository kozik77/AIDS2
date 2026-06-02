# Wizualizacja mapy królestwa - rysuje kopalnie i trasę patrolu księcia

import matplotlib.pyplot as plt
from snowwhite_suite.modele import Punkt
from snowwhite_suite.modul2_hull import OtoczkaWypukla

def rysuj_mape_krolestwa():
    punkty_w_terenie = [
        Punkt(0, 0), Punkt(5, 0), Punkt(0, 5), Punkt(5, 5),
        Punkt(2, 2), Punkt(3, 3)
    ]

    otoczka = OtoczkaWypukla()
    trasa = otoczka.buduj(punkty_w_terenie)

    plt.figure(figsize=(8, 6))
    plt.title('Mapa Królestwa: Trasa Patrolu Księcia', fontsize=14, pad=15)

    # niebieskie = wszystkie punkty, czerwone = trasa patrolu
    x_wszystkie = [p.x for p in punkty_w_terenie]
    y_wszystkie = [p.y for p in punkty_w_terenie]
    plt.scatter(x_wszystkie, y_wszystkie, color='blue', s=60, label='Wszystkie kopalnie', zorder=5)

    trasa_zamknieta = trasa + [trasa[0]]
    x_trasa = [p.x for p in trasa_zamknieta]
    y_trasa = [p.y for p in trasa_zamknieta]
    
    plt.plot(x_trasa, y_trasa, color='red', linestyle='-', linewidth=2, label='Trasa Patrolu (Otoczka)', zorder=4)
    plt.scatter(x_trasa, y_trasa, color='red', s=100, zorder=6)

    for p in punkty_w_terenie:
        plt.annotate(f'({p.x}, {p.y})', (p.x, p.y), textcoords="offset points", xytext=(0,10), ha='center')

    plt.grid(True, linestyle='--', alpha=0.6)
    plt.legend(loc='upper right')
    
    plt.show()

if __name__ == '__main__':
    rysuj_mape_krolestwa()