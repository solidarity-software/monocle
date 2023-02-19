import { lex, Token, TokenType } from "../src";

function expectNext(lexer: Generator<Token, void, unknown>): Token {
  const value = lexer.next().value;

  expect(value).toBeInstanceOf(Object);

  return value as Token;
}

function expectDone(lexer: Generator<Token, void, unknown>) {
  const value = lexer.next();

  expect(value.done).toBe(true);
}

test("can lex module token", () => {
  const lexer = lex("   module Bob123");

  let value = expectNext(lexer);

  expect(value.type).toBe(TokenType.ModuleKeyword);

  value = expectNext(lexer);

  expect(value.type).toBe(TokenType.TypeIdentifer);

  expect(lexer.next().done).toBeTruthy();
});

function expectType<T extends Token & { type: TT }, TT extends TokenType>(
  value: Token,
  type: TT
): value is T {
  expect(value.type).toBe(type);
  return true;
}

test("Can recover from missing module token", () => {
  const lexer = lex("    Test");

  let value = expectNext(lexer);

  if (expectType(value, TokenType.Error)) {
    expect(value.reason).toBe("Expected module keyword");
  }

  value = expectNext(lexer);

  expectType(value, TokenType.TypeIdentifer);

  expectDone(lexer);
});
