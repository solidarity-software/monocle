export function assertNonNullish<TValue>(
  value: TValue,
  message: string
): asserts value is NonNullable<TValue> {
  if (value === null || value === undefined) {
    throw Error(message);
  }
}

export class Location {
  public pos = 0;
  public col = 0;
  public line = 0;

  static copy(other: Location) {
    const loc = new Location();
    loc.col = other.col;
    loc.line = other.line;
    loc.pos = other.pos;

    return loc;
  }
}

export enum TokenType {
  Identifier = "Identifier",
  LetKeyword = "Let",
  Error = "Error",
  Assignment = "Assignment",
  Number = "Number",
}

export type ErrorToken = TokenBase & {
  type: TokenType.Error;
  reason: string;
};

export type Token = ErrorToken;

export type TokenBase = {
  start: Location;
  end: Location;
};

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

export class BaseLexer {
  public start = new Location();
  public cur = new Location();
  public text = "";

  constructor(text: string) {
    this.text = text;
  }

  peek() {
    return this.text.codePointAt(this.cur.pos);
  }

  next() {
    const c = this.text.codePointAt(this.cur.pos);

    assertNonNullish(c, "invalid code point");
    this.cur.pos += codePointLen(c);

    if ("\n".codePointAt(0) === this.cur.pos) {
      this.cur.line += 1;
      this.cur.col = 0;
    }

    return c;
  }

  len() {
    return this.text.length - this.cur.pos;
  }

  isNumeric() {
    const c = this.peek();
    if (c == undefined) {
      return false;
    }
    return String.fromCodePoint(c).match(/\p{N}/gu);
  }

  acceptAny(chars: string) {
    const c = this.peek();

    if (c === undefined) {
      return false;
    }

    if (chars.includes(String.fromCodePoint(c))) {
      this.next();
      return true;
    }

    return false;
  }

  accept(str: string) {
    if (this.len() < str.length) {
      return false;
    }

    const oldCur = Location.copy(this.cur);

    for (const c of eachCodePoint(str)) {
      if (this.next() !== c) {
        this.cur = oldCur;
        return false;
      }
    }
    return true;
  }

  skipNonWhitespace() {
    for (;;) {
      const c = this.peek();

      if (c == null) {
        return;
      }

      if (String.fromCodePoint(c).match(/\p{Space_Separator}/gu)) {
        break;
      }
      this.next();
    }

    this.start = Location.copy(this.cur);
  }

  skipWhitespace() {
    while (this.acceptAny(" \t")) {
      /* empty */
    }

    this.start = Location.copy(this.cur);
  }

  skipBlankLines() {
    for (;;) {
      this.skipWhitespace();

      const c = this.peek();

      if (c == null) {
        return;
      }
      if (!String.fromCodePoint(c).match(/\n/gu)) {
        this.start = Location.copy(this.cur);

        return;
      }
      this.next();
    }
  }

  isAlphabetic() {
    const c = this.peek();
    if (c == undefined) {
      return false;
    }
    return String.fromCodePoint(c).match(/\p{L}/gu);
  }

  isAlphaNumeric() {
    return this.isAlphabetic() || this.isNumeric();
  }

  makeToken(type: TokenType): Token {
    const token = {
      type: type,
      start: Location.copy(this.start),
      end: Location.copy(this.cur),
    };

    this.start = Location.copy(this.cur);

    return token as Token;
  }
}

export class Lexer extends BaseLexer {
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
