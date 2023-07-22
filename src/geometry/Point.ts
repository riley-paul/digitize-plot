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
    const color = options.color || "crimson";
    
    ctx.lineWidth = 2 / scale

    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();

    if (this.label) {
      const fontHeight = 12 / scale;
      const textOffset = 10 / scale;

      ctx.font = `${fontHeight}px courier`;
      ctx.fillStyle = "darkgray";

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
