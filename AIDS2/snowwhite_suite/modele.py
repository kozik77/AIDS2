from dataclasses import dataclass

@dataclass(frozen=True)
class Punkt:
    """Reprezentuje podstawowy punkt geometryczny na płaszczyźnie (dwuwymiarowej)."""
    x: float
    y: float

@dataclass
class Wierzcholek:
    """Reprezentuje punkt wyrobiska posiadający współrzędne oraz identyfikator."""
    x: float
    y: float
    id_wyrobiska: int

@dataclass
class Krawedz:
    """Reprezentuje krawędź w sieci przepływowej dla algorytmu MCMF."""
    do_: int
    przepustowosc: int
    koszt: int
    odwrotna: int  # Indeks krawędzi odwrotnej w liście sąsiedztwa drugiego wierzchołka