import { BaseLexer, TokenType } from "./base";

export { TokenType, Token } from "./base";

class Lexer extends BaseLexer {
  constructor(text: string) {
    super(text);
  }

  letKeyword() {
    if (!this.accept("let")) {
      return null;
    }

    return this.makeToken(TokenType.LetKeyword);
  }

  assignment() {
    if (!this.accept("=")) {
      return null;
    }

    return this.makeToken(TokenType.Assignment);
  }

  identifier() {
    if (!this.isAlphabetic()) {
      return null;
    }
    this.next();

    while (this.isAlphaNumeric()) {
      this.next();
    }
    return this.makeToken(TokenType.Identifier);
  }

  number() {
    if (!this.isNumeric()) {
      return null;
    }
    this.next();
    while (this.isNumeric()) {
      this.next();
    }
    return this.makeToken(TokenType.Number);
  }

  error(reason: string) {
    const token = {
      ...this.makeToken(TokenType.Error),
      reason,
    };

    this.skipNonWhitespace();

    return token;
  }

  *lex() {
    while (this.peek() != null) {
      this.skipBlankLines();
      if (this.peek() == null) {
        return;
      }
      yield this.letKeyword() ||
        this.assignment() ||
        this.identifier() ||
        this.number() ||
        this.error("invalid token");
    }
  }
}

export function* lex(text: string) {
  const lexer = new Lexer(text);
  yield* lexer.lex();
}
