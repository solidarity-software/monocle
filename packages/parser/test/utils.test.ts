import { assertNonNullish } from "../src/utils";

test("utils", () => {
  expect(() => assertNonNullish(null, "")).toThrow();
  expect(() => assertNonNullish(undefined, "")).toThrow();
});
