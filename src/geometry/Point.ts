type PointDrawOptions = {
  color?: string;
  radius?: number;
};

export default class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get coordinates(): number[] {
    return [this.x, this.y];
  }

  draw(ctx: CanvasRenderingContext2D, options: PointDrawOptions = {}) {
    const radius = options.radius || 3;
    const color = options.color || "crimson";

    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  toString() {
    return `POINT (${this.coordinates
      .map((coord) => Math.round(coord * 1000) / 1000)
      .join(" ")})`;
  }

  distOther(other: Point): number {
    const deltaX = this.coordinates[0] - other.coordinates[0];
    const deltaY = this.coordinates[1] - other.coordinates[1];
    return Math.hypot(deltaX, deltaY);
  }

  nearest(others: Point[]): Point | undefined {
    return others.sort((a, b) => this.distOther(a) - this.distOther(b))[0];
  }
}
