// takes a token generator and returns an AST

import type { Token } from "./lexer";

type PeekableGenerator<T1> = Generator<T1> & { peek: () => IteratorResult<T1> };

function peekable<T1>(iterator: Generator<T1>) {
  let state = iterator.next();

  const _i = <PeekableGenerator<T1>>(function* () {
    while (!state.done) {
      const current = state.value;
      state = iterator.next();
      yield current;
    }
    return;
  })();

  _i.peek = () => state;

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
