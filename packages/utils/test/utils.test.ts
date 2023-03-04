import { eachCodePoint, peekable } from "../src";

test("utils", () => {
  const codes: Array<number> = [];
  for (const c of eachCodePoint("l𝒳t")) {
    codes.push(c);
  }

  expect(codes).toEqual([0x6c, 0x1d4b3, 0x74]);
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
