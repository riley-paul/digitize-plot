import { expect, test } from "vitest";
import { linearInterp } from "./linear";

test("linearInterp", () => {
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
