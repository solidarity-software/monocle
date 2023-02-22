import { Token, TokenType } from "../src";

export function expectNext(lexer: Generator<Token, void, unknown>): Token {
  const value = lexer.next().value;

  expect(value).toBeInstanceOf(Object);

  return value as Token;
}

export function expectDone(lexer: Generator<Token, void, unknown>) {
  const value = lexer.next();

  expect(value.done).toBe(true);
}

export function expectType<
  T extends Token & { type: TT },
  TT extends TokenType
>(value: Token, type: TT): value is T {
  expect(value.type).toBe(type);
  return true;
}
