export type Location = {
  pos: number;
  col: number;
  line: number;
};

export type LexerContext = {
  cur: Location;
  start: Location;
  text: string;
};

export enum TokenType {
  ModuleKeyword = "ModuleKeyword",
  TypeIdentifer = "TypeIdentifer",
  Identifier = "Identifier",
  Error = "Error",
}

export type IdentifierToken = {
  type: TokenType.Identifier;
  name: string;
};

export type TypeIdentiferToken = {
  type: TokenType.TypeIdentifer;
  name: string;
};

export type ModuleToken = TokenBase & {
  type: TokenType.ModuleKeyword;
};

export type ErrorToken = TokenBase & {
  type: TokenType.Error;
  reason: string;
};

export type Token =
  | IdentifierToken
  | ModuleToken
  | ErrorToken
  | TypeIdentiferToken;

export type TokenBase = {
  start: Location;
  end: Location;
};

export function* lex(text: string): Generator<Token, void, unknown> {
  const _ctx: LexerContext = {
    start: {
      pos: 0,
      line: 0,
      col: 0,
    },
    cur: {
      pos: 0,
      line: 0,
      col: 0,
    },
    text,
  };

  for (const token of file()) {
    yield token;
  }

  function error(reason: string) {
    return {
      ...makeToken(TokenType.Error),
      reason,
    };
  }

  function* file() {
    skipWhitespace();
    yield moduleKeyword() || error("Expected module keyword");
    skipWhitespace();
    yield typeName() || error("Expected name of module.");
  }

  // #region utils for making tokens

  function codePointLen(c: number) {
    if (c >= 0xd800 && c < 0xdc00) {
      return 2;
    }
    return 1;
  }

  function peek() {
    return _ctx.text.codePointAt(_ctx.cur.pos);
  }

  function next() {
    const c = _ctx.text.codePointAt(_ctx.cur.pos);

    if (c === undefined) {
      return;
    }
    _ctx.cur.pos += codePointLen(c);

    if ("\n".codePointAt(0) === _ctx.cur.pos) {
      _ctx.cur.line += 1;
      _ctx.cur.col = 0;
    }

    return c;
  }

  function len() {
    return _ctx.text.length - _ctx.cur.pos;
  }

  function copyCur(): Location {
    return { ..._ctx.cur };
  }

  function* eachCodePoint(str: string) {
    for (let i = 0; i < str.length; i++) {
      const c = str.codePointAt(i);
      if (c === undefined) {
        return;
      }

      if (codePointLen(c) === 2) {
        i++;
      }
      yield c;
    }
  }

  function acceptAny(chars: string) {
    const c = peek();

    if (c === undefined) {
      return false;
    }
    if (chars.includes(String.fromCodePoint(c))) {
      next();
      return true;
    }

    return false;
  }

  function accept(str: string) {
    if (len() < str.length) {
      return false;
    }

    const oldCur = copyCur();

    for (const c of eachCodePoint(str)) {
      if (next() !== c) {
        _ctx.cur = oldCur;
        return false;
      }
    }
    return true;
  }

  function skipWhitespace() {
    while (acceptAny(" \t")) {
      /* empty */
    }

    _ctx.start = { ..._ctx.cur };
  }

  function makeToken(type: TokenType): Token {
    const token = {
      type: type,
      start: { ..._ctx.start },
      end: { ..._ctx.cur },
    };

    _ctx.start = { ..._ctx.cur };

    return token as Token;
  }

  // #endregion

  function moduleKeyword() {
    if (!accept("module")) {
      return null;
    }

    return makeToken(TokenType.ModuleKeyword);
  }

  function isAlphabetic() {
    const c = peek();
    if (c == undefined) {
      return false;
    }
    return String.fromCodePoint(c).match(/\p{L}/gu);
  }

  function isAlphaNumeric() {
    return isAlphabetic() || isNumeric();
  }

  function isNumeric() {
    const c = peek();
    if (c == undefined) {
      return false;
    }
    return String.fromCodePoint(c).match(/\p{N}/gu);
  }

  function isUppercase() {
    const c = peek();
    if (c == undefined) {
      return false;
    }
    return String.fromCodePoint(c).match(/\p{Lu}/gu);
  }

  function typeName() {
    if (!isUppercase()) {
      return null;
    }
    next();
    while (isAlphaNumeric()) {
      next();
    }
    return makeToken(TokenType.TypeIdentifer);
  }
}
