from manim import *
class Bench(Scene):
    def construct(self):
        self.camera.background_color = "#0B1A3A"
        c = Circle(radius=2, color="#22D3EE", fill_opacity=1).shift(LEFT * 3)
        sq = Square(side_length=4, color="#22D3EE", fill_opacity=1).shift(RIGHT * 3)
        path = CubicBezier(LEFT * 6 + DOWN * 3, LEFT * 2 + DOWN * 1, RIGHT * 2 + DOWN * 4, RIGHT * 6 + DOWN * 2, color="#FFB703", stroke_width=10)
        dot = Dot(color="#EF476F", radius=0.25)
        t = Text("4560 ± 65 BP", font="JetBrains Mono", color=WHITE).to_edge(UP)
        self.add(c)
        self.play(Transform(c, sq), Create(path), MoveAlongPath(dot, path), Write(t), run_time=3)
