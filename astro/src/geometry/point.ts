type PointDrawOptions = {
  color?: string;
  stroke?: string;
  radius?: number;
  labelPos?: "t" | "b" | "l" | "r";
  showLabel?: boolean;
};

import { v4 as uuidv4 } from "uuid";

export default class Point {
  x: number;
  y: number;
  id: string;
  label: string;

  constructor(x: number, y: number, id = uuidv4(), label = "") {
    this.x = x;
    this.y = y;
    this.id = id;
    this.label = label;
  }

  draw(ctx: CanvasRenderingContext2D, options: PointDrawOptions = {}) {
    const scale = ctx.getTransform().a;
    const radius = (options.radius || 5) / scale;
    const outerRadius = radius * 1.5;
    const innerRadius = radius * 0.5;
    const color = options.color || "black";

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    ctx.lineCap = "round";
    ctx.lineWidth = 2 / scale;

    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.fillStyle = "rgba(250,250,250,0.3)";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    drawLine(this.x + innerRadius, this.y, this.x + outerRadius, this.y);
    drawLine(this.x - innerRadius, this.y, this.x - outerRadius, this.y);
    drawLine(this.x, this.y + innerRadius, this.x, this.y + outerRadius);
    drawLine(this.x, this.y - innerRadius, this.x, this.y - outerRadius);

    if (this.label) {
      const fontHeight = 12 / scale;
      const textOffset = radius * 2.2;

      ctx.font = `${fontHeight}px courier`;
      ctx.fillStyle = "hsl(220 8.9% 46.1%)";

      switch (options.labelPos) {
        case "r":
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(this.label, this.x + textOffset, this.y);
          break;
        case "l":
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          ctx.fillText(this.label, this.x - textOffset, this.y);
          break;
        case "b":
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(this.label, this.x, this.y + textOffset);
          break;
        default:
          ctx.textAlign = "center";
          ctx.textBaseline = "alphabetic";
          ctx.fillText(this.label, this.x, this.y - textOffset);
          break;
      }

      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }
  }

  distOther(other: Point): number {
    const deltaX = this.x - other.x;
    const deltaY = this.y - other.y;
    return Math.hypot(deltaX, deltaY);
  }

  nearest(others: Point[]): Point | undefined {
    return others.sort((a, b) => this.distOther(a) - this.distOther(b))[0];
  }
}
