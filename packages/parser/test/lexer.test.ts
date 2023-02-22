import { assertNonNullish, eachCodePoint, lex, TokenType } from "../src";
import { expectDone, expectNext, expectType } from "./utils";

test("complex example", () => {
  const lexer = lex(`  
  
  let abc = 11
  a ^ ^ `);

  expectType(expectNext(lexer), TokenType.LetKeyword);
  expectType(expectNext(lexer), TokenType.Identifier);
  expectType(expectNext(lexer), TokenType.Assignment);
  expectType(expectNext(lexer), TokenType.Number);
  expectType(expectNext(lexer), TokenType.Identifier);
  expectType(expectNext(lexer), TokenType.Error);
  expectType(expectNext(lexer), TokenType.Error);

  expectDone(lexer);
});

test("identifier", () => {
  const lexer = lex("a");

  expectType(expectNext(lexer), TokenType.Identifier);

  expectDone(lexer);
});

test("last char invalid", () => {
  const lexer = lex("^");

  expectType(expectNext(lexer), TokenType.Error);

  expectDone(lexer);
});

test("utils", () => {
  for (const c of eachCodePoint("l𝒳t")) {
    c;
  }

  expect(() => assertNonNullish(null, "")).toThrow();
  expect(() => assertNonNullish(undefined, "")).toThrow();
});
