import Point from "./Point";

type DrawOptions = {
  color?: string;
  width?: number;
};

const INFINITE = 10_000;

export default class Calibrator {
  id: string;
  screen: number;
  actual: number;
  axis: "x" | "y";

  constructor(id: string, screen: number, actual = 0, axis: "x" | "y") {
    this.id = id;
    this.screen = screen;
    this.axis = axis;
    this.actual = actual;
  }

  draw(ctx: CanvasRenderingContext2D, options: DrawOptions = {}) {
    const scale = ctx.getTransform().a;
    const color = options.color || "black";
    const width = (options.width || 2) / scale;

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    ctx.lineCap = "round"
    ctx.lineWidth = width
    ctx.strokeStyle = color

    if (this.axis === "x") {
      drawLine(this.screen, -INFINITE, this.screen, INFINITE);
    } else {
      drawLine(-INFINITE, this.screen, INFINITE, this.screen);
    }
  }

  distPoint(point: Point): number {
    if (this.axis === "x") return Math.abs(point.x - this.actual);
    if (this.axis === "y") return Math.abs(point.y - this.actual);
    return INFINITE;
  }
}
