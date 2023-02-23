import { lex } from "@monocle-lang/lexer";
import { parse } from "../src";

test("sadf", () => {
  expect(true).toEqual(true);
  const a = parse(lex(""));
  console.log(a);
});
