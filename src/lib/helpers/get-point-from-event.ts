import Point from "@/geometry/point";
import type React from "react";

export default function getPointFromEvent(
  event: React.MouseEvent,
  ctx: CanvasRenderingContext2D,
): Point {
  const pt = new DOMPoint(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  const transformed = ctx.getTransform().invertSelf().transformPoint(pt);
  return new Point(transformed.x, transformed.y, "MOUSE");
}
