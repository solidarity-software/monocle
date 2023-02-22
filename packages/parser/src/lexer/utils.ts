import { assertNonNullish } from "../utils";

export function codePointLen(c: number) {
  if (c >= 0x10000 && c < 0x10ffff) {
    return 2;
  }
  return 1;
}

export function* eachCodePoint(str: string) {
  for (let i = 0; i < str.length; i++) {
    const c = str.codePointAt(i);
    assertNonNullish(c, "invalid code point");

    if (codePointLen(c) === 2) {
      i++;
    }
    yield c;
  }
}
