import type { Token } from "../lexer";

type BaseNode = {};

type PeekableGenerator<T1> = Generator<T1> & { peek: () => IteratorResult<T1> };

function peekable<T1>(iterator: Generator<T1>) {
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

class Parser {
  lexer: PeekableGenerator<Token>;
  constructor(lexer: Generator<Token>) {
    this.lexer = peekable(lexer);
  }

  parse() {}

  expression() {}
}

export function parse(lexer: Generator<Token>) {
  return new Parser(lexer).parse();
}
