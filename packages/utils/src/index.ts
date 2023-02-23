export function assertNonNullish<TValue>(
  value: TValue,
  message: string
): asserts value is NonNullable<TValue> {
  if (value === null || value === undefined) {
    throw Error(message);
  }
}

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

export type PeekableGenerator<T1> = Generator<T1> & {
  peek: () => IteratorResult<T1>;
};

export function peekable<T1>(iterator: Generator<T1>) {
  let result = iterator.next();

  const _i = <PeekableGenerator<T1>>(function* () {
    while (!result.done) {
      const current = result.value;
      result = iterator.next();
      yield current;
    }
    return;
  })();

  _i.peek = () => result;

  return _i;
}
