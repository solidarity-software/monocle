export function codePointLen(c: number) {
  if (c >= 0x10000 && c < 0x10ffff) {
    return 2;
  }
  return 1;
}

export function* eachCodePoint(str: string) {
  for (let i = 0; i < str.length; i++) {
    const c = str.codePointAt(i);

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    if (codePointLen(c!) === 2) {
      i++;
    }
    yield c!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
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
