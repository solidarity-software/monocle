import { Token, TokenType } from "@monocle-lang/lexer";
import { peekable, PeekableGenerator } from "@monocle-lang/utils";
import {
  AstNode,
  AType,
  BaseNode,
  ANumber,
  AOperator,
  AError,
  ABinOperation,
} from "./types";

class Parser {
  lexer: PeekableGenerator<Token>;
  constructor(lexer: Generator<Token>) {
    this.lexer = peekable(lexer);
  }

  accept<T extends TokenType>(t: T): (Token & { type: T }) | undefined {
    if (this.lexer.peek().done) {
      return;
    }

    if (this.lexer.peek().value.type == t) {
      return this.lexer.next().value;
    }
    return;
  }

  makeAstNode<T extends AType>(
    typ: T,
    begin: Token | AstNode,
    stop?: Token | AstNode
  ): BaseNode & { type: T } {
    const start = { ...begin.start };
    const end = stop != null ? { ...stop.end } : { ...begin.end };

    return {
      type: typ,
      start,
      end,
    };
  }

  number(): ANumber | undefined {
    const n1 = this.accept(TokenType.Number);
    if (n1 == null) {
      return;
    }
    return { ...this.makeAstNode(AType.Number, n1), value: n1 };
  }

  operator(): AOperator | undefined {
    const n1 = this.accept(TokenType.Operator);
    if (n1 == null) {
      return;
    }
    return { ...this.makeAstNode(AType.Operator, n1), value: n1 };
  }

  binaryOperation(
    operator: AOperator,
    left: AstNode,
    right: AstNode
  ): ABinOperation {
    return {
      ...this.makeAstNode(AType.BinaryOperation, left, right),
      left,
      right,
      operator,
    };
  }

  error(msg: string): AError {
    const n1 = this.lexer.next();
    if (n1.done) throw Error("read past end of file");
    return {
      ...this.makeAstNode(AType.Error, n1.value),
      reason: msg,
      value: n1.value,
    };
  }

  parse(): AstNode | undefined {
    const n1 = this.number() || this.error("expecting number");
    if (n1.type == AType.Error) {
      return n1;
    }

    const o = this.operator() || this.error("expecting operator");
    if (o.type == AType.Error) {
      return o;
    }

    const n2 = this.number() || this.error("expecting number");
    if (n2.type == AType.Error) {
      return n2;
    }

    return this.binaryOperation(o, n1, n2);
  }
}

export function parse(lexer: Generator<Token>) {
  return new Parser(lexer).parse();
}
