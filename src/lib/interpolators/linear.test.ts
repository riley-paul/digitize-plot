import { expect, test, describe } from "vitest";
import { linearInterp, linearCoordsConverterGenerator } from "./linear";
import Point from "../../geometry/point";

describe("linearInterp", () => {
  test("interpolates midpoint correctly", () => {
    expect(
      linearInterp({
        x: 3,
        x0: 1,
        x1: 5,
        y0: 10,
        y1: 20,
      }),
    ).toBe(15);
  });

  test("interpolates at start point", () => {
    expect(
      linearInterp({
        x: 1,
        x0: 1,
        x1: 5,
        y0: 10,
        y1: 20,
      }),
    ).toBe(10);
  });

  test("interpolates at end point", () => {
    expect(
      linearInterp({
        x: 5,
        x0: 1,
        x1: 5,
        y0: 10,
        y1: 20,
      }),
    ).toBe(20);
  });

  test("extrapolates beyond upper bound", () => {
    expect(
      linearInterp({
        x: 7,
        x0: 1,
        x1: 5,
        y0: 10,
        y1: 20,
      }),
    ).toBe(25);
  });

  test("extrapolates beyond lower bound", () => {
    expect(
      linearInterp({
        x: -1,
        x0: 1,
        x1: 5,
        y0: 10,
        y1: 20,
      }),
    ).toBe(5);
  });

  test("handles negative slope", () => {
    expect(
      linearInterp({
        x: 3,
        x0: 1,
        x1: 5,
        y0: 20,
        y1: 10,
      }),
    ).toBe(15);
  });

  test("handles negative coordinates", () => {
    expect(
      linearInterp({
        x: -2,
        x0: -4,
        x1: 0,
        y0: -10,
        y1: 10,
      }),
    ).toBe(0);
  });

  test("handles zero y-values", () => {
    expect(
      linearInterp({
        x: 3,
        x0: 1,
        x1: 5,
        y0: 0,
        y1: 20,
      }),
    ).toBe(10);
  });

  test("handles fractional values", () => {
    expect(
      linearInterp({
        x: 1.5,
        x0: 1,
        x1: 2,
        y0: 10,
        y1: 20,
      }),
    ).toBe(15);
  });

  test("handles very small intervals", () => {
    expect(
      linearInterp({
        x: 0.001,
        x0: 0,
        x1: 0.002,
        y0: 0,
        y1: 10,
      }),
    ).toBe(5);
  });

  test("handles large numbers", () => {
    expect(
      linearInterp({
        x: 5000,
        x0: 0,
        x1: 10000,
        y0: 0,
        y1: 100,
      }),
    ).toBe(50);
  });

  test("returns y0 when x equals x0 (edge case)", () => {
    expect(
      linearInterp({
        x: 5,
        x0: 5,
        x1: 10,
        y0: 100,
        y1: 200,
      }),
    ).toBe(100);
  });
});

describe("linearCoordsConverterGenerator", () => {
  test("converts coordinates with simple linear calibration", () => {
    const converter = linearCoordsConverterGenerator({
      x1: { coord: 0, value: 0 },
      x2: { coord: 100, value: 10 },
      y1: { coord: 0, value: 0 },
      y2: { coord: 100, value: 10 },
    } as any);

    const result = converter(new Point(50, 50, "test-1"));
    expect(result.x).toBe(5);
    expect(result.y).toBe(5);
    expect(result.id).toBe("test-1");
  });

  test("converts coordinates with offset calibration", () => {
    const converter = linearCoordsConverterGenerator({
      x1: { coord: 100, value: 0 },
      x2: { coord: 200, value: 10 },
      y1: { coord: 100, value: 0 },
      y2: { coord: 200, value: 10 },
    } as any);

    const result = converter(new Point(150, 150, "test-2"));
    expect(result.x).toBe(5);
    expect(result.y).toBe(5);
    expect(result.id).toBe("test-2");
  });

  test("converts coordinates with negative values", () => {
    const converter = linearCoordsConverterGenerator({
      x1: { coord: 0, value: -10 },
      x2: { coord: 100, value: 10 },
      y1: { coord: 0, value: -10 },
      y2: { coord: 100, value: 10 },
    } as any);

    const result = converter(new Point(50, 50, "test-3"));
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.id).toBe("test-3");
  });

  test("converts coordinates with different x and y scales", () => {
    const converter = linearCoordsConverterGenerator({
      x1: { coord: 0, value: 0 },
      x2: { coord: 100, value: 100 },
      y1: { coord: 0, value: 0 },
      y2: { coord: 100, value: 50 },
    } as any);

    const result = converter(new Point(50, 50, "test-4"));
    expect(result.x).toBe(50);
    expect(result.y).toBe(25);
    expect(result.id).toBe("test-4");
  });

  test("converts coordinates at calibration points", () => {
    const converter = linearCoordsConverterGenerator({
      x1: { coord: 10, value: 100 },
      x2: { coord: 90, value: 900 },
      y1: { coord: 20, value: 200 },
      y2: { coord: 80, value: 800 },
    } as any);

    const result1 = converter(new Point(10, 20, "test-5a"));
    expect(result1.x).toBe(100);
    expect(result1.y).toBe(200);

    const result2 = converter(new Point(90, 80, "test-5b"));
    expect(result2.x).toBe(900);
    expect(result2.y).toBe(800);
  });

  test("preserves point ID through conversion", () => {
    const converter = linearCoordsConverterGenerator({
      x1: { coord: 0, value: 0 },
      x2: { coord: 100, value: 10 },
      y1: { coord: 0, value: 0 },
      y2: { coord: 100, value: 10 },
    } as any);

    const pointId = "unique-point-id-123";
    const result = converter(new Point(25, 75, pointId));
    expect(result.id).toBe(pointId);
  });

  test("handles fractional coordinate values", () => {
    const converter = linearCoordsConverterGenerator({
      x1: { coord: 0, value: 0 },
      x2: { coord: 100, value: 1 },
      y1: { coord: 0, value: 0 },
      y2: { coord: 100, value: 1 },
    } as any);

    const result = converter(new Point(33.33, 66.67, "test-6"));
    expect(result.x).toBeCloseTo(0.3333, 3);
    expect(result.y).toBeCloseTo(0.6667, 3);
  });

  test("handles inverted y-axis (common in screen coordinates)", () => {
    const converter = linearCoordsConverterGenerator({
      x1: { coord: 0, value: 0 },
      x2: { coord: 100, value: 10 },
      y1: { coord: 100, value: 0 },
      y2: { coord: 0, value: 10 },
    } as any);

    const result = converter(new Point(50, 50, "test-7"));
    expect(result.x).toBe(5);
    expect(result.y).toBe(5);
  });
});
