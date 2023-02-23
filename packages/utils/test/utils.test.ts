import { assertNonNullish, eachCodePoint, peekable } from "../src";

test("utils", () => {
  for (const c of eachCodePoint("l𝒳t")) {
    c;
  }

  expect(() => assertNonNullish(null, "")).toThrow();
  expect(() => assertNonNullish(undefined, "")).toThrow();
});

test("peekable", () => {
  const it = (function* () {
    yield* [1, 2, 3];
  })();

  const pit = peekable(it);

  expect(pit.peek().value).toEqual(1);
  expect(pit.next().value).toEqual(1);

  expect(pit.peek().value).toEqual(2);
  expect(pit.next().value).toEqual(2);

  expect(pit.peek().value).toEqual(3);
  expect(pit.next().value).toEqual(3);

  expect(pit.next().done).toEqual(true);
});
