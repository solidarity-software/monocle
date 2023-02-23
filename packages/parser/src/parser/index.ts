import type { Token } from "@monocle-lang/lexer";
import { peekable, PeekableGenerator } from "@monocle-lang/utils";

class Parser {
  lexer: PeekableGenerator<Token>;
  constructor(lexer: Generator<Token>) {
    this.lexer = peekable(lexer);
  }

  parse() {
    return this.lexer.next();
  }
}

export function parse(lexer: Generator<Token>) {
  return new Parser(lexer).parse();
}
