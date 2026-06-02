from dataclasses import dataclass

@dataclass(frozen=True)
class Punkt:
    x: float
    y: float