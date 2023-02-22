import { codePointLen, eachCodePoint } from "./utils";
import { assertNonNullish } from "../utils";

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
  Operator = "Operator",
}

export type ErrorToken = TokenBase & {
  type: TokenType.Error;
  reason: string;
};

export type IdentifierToken = TokenBase & {
  type: TokenType.Identifier;
};

export type LetToken = TokenBase & {
  type: TokenType.LetKeyword;
};

export type AssignmentToken = TokenBase & {
  type: TokenType.Assignment;
};

export type NumberToken = TokenBase & {
  type: TokenType.Number;
};

export type Token =
  | ErrorToken
  | IdentifierToken
  | LetToken
  | AssignmentToken
  | NumberToken;

export type TokenBase = {
  start: Location;
  end: Location;
};

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
    for (;;) {
      const c = this.peek();

      if (c == null) {
        return;
      }

      if (!String.fromCodePoint(c).match(/\p{Space_Separator}/gu)) {
        break;
      }
      this.next();
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
        break;
      }
      this.next();
    }

    this.start = Location.copy(this.cur);
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
