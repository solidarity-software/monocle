import { lex, TokenType } from "../src";
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
  expectType(expectNext(lexer), TokenType.Operator);
  expectType(expectNext(lexer), TokenType.Operator);

  expectDone(lexer);
});

test("identifier", () => {
  const lexer = lex("a");

  expectType(expectNext(lexer), TokenType.Identifier);

  expectDone(lexer);
});

test("operator", () => {
  const lexer = lex("++++");

  expectType(expectNext(lexer), TokenType.Operator);

  expectDone(lexer);
});

test("unsupported character", () => {
  const lexer = lex(`\u20E2`);

  expectType(expectNext(lexer), TokenType.Error);

  expectDone(lexer);
});

test("unsupported character", () => {
  const lexer = lex(`\u20E2 `);

  expectType(expectNext(lexer), TokenType.Error);

  expectDone(lexer);
});
