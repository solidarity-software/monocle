import { lex } from "@monocle-lang/lexer";
import { parse } from "../src";

test("sadf", () => {
  expect(true).toEqual(true);
  const ast = parse(lex("1 + 2"));

  const exp = {
    type: "BinaryOperation",
    start: {
      pos: 0,
      col: 0,
      line: 0,
    },
    end: {
      pos: 5,
      col: 0,
      line: 0,
    },
    left: {
      type: "Number",
      start: {
        pos: 0,
        col: 0,
        line: 0,
      },
      end: {
        pos: 1,
        col: 0,
        line: 0,
      },
      value: {
        type: "Number",
        start: {
          pos: 0,
          col: 0,
          line: 0,
        },
        end: {
          pos: 1,
          col: 0,
          line: 0,
        },
      },
    },
    right: {
      type: "Number",
      start: {
        pos: 4,
        col: 0,
        line: 0,
      },
      end: {
        pos: 5,
        col: 0,
        line: 0,
      },
      value: {
        type: "Number",
        start: {
          pos: 4,
          col: 0,
          line: 0,
        },
        end: {
          pos: 5,
          col: 0,
          line: 0,
        },
      },
    },
    operator: {
      type: "Operator",
      start: {
        pos: 2,
        col: 0,
        line: 0,
      },
      end: {
        pos: 3,
        col: 0,
        line: 0,
      },
      value: {
        type: "Operator",
        start: {
          pos: 2,
          col: 0,
          line: 0,
        },
        end: {
          pos: 3,
          col: 0,
          line: 0,
        },
      },
    },
  };

  expect(ast).toEqual(exp);
});
