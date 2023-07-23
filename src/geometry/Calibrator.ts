import Point from "./Point";

type DrawOptions = {
  colorX?: string;
  colorY?: string;
  width?: number;
};

export default class Calibrator {
  id: string;
  coord: number;
  value: number;
  axis: "x" | "y";

  constructor(id: string, coord: number, value = 0, axis: "x" | "y") {
    this.id = id;
    this.coord = coord;
    this.axis = axis;
    this.value = value;
  }

  draw(ctx: CanvasRenderingContext2D, options: DrawOptions = {}) {
    const origin = ctx
      .getTransform()
      .invertSelf()
      .transformPoint(new DOMPoint(0, 0));

    const extent = ctx
      .getTransform()
      .invertSelf()
      .transformPoint(new DOMPoint(ctx.canvas.width, ctx.canvas.height));

    const scale = ctx.getTransform().a;
    const colorX = options.colorX || "blue";
    const colorY = options.colorX || "red";
    const width = (options.width || 1.5) / scale;
    const buffer = 10 / scale;
    const fontHeight = 12 / scale;
    const textOffset = 7 / scale;

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    ctx.lineCap = "round";
    ctx.lineWidth = width;

    ctx.font = `${fontHeight}px courier`;
    ctx.fillStyle = "hsl(220 8.9% 46.1%)";

    ctx.setLineDash([15, 5]);

    if (this.axis === "x") {
      ctx.save();
      ctx.translate(this.coord - textOffset, origin.y + buffer);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "right";
      ctx.fillText(`${this.id.toUpperCase()} - ${this.value}`, 0, 0);
      ctx.restore();

      ctx.strokeStyle = colorX;
      drawLine(this.coord, origin.y + buffer, this.coord, extent.y - buffer);
    } else {
      ctx.textAlign = "left";
      ctx.fillText(
        `${this.id.toUpperCase()} - ${this.value}`,
        origin.x + buffer,
        this.coord - textOffset
      );

      ctx.strokeStyle = colorY;
      drawLine(origin.x + buffer, this.coord, extent.x - buffer, this.coord);
    }

    ctx.setLineDash([]);
  }

  distPoint(point: Point): number {
    if (this.axis === "x") return Math.abs(point.x - this.coord);
    return Math.abs(point.y - this.coord);
  }
}
