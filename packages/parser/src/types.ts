import type { TextLocation, Token } from "@monocle-lang/lexer";

export enum AType {
  Number = "Number",
  BinaryOperation = "BinaryOperation",
  Operator = "Operator",
  Error = "Error",
}

export type BaseNode = {
  type: AType;
  start: TextLocation;
  end: TextLocation;
};

export type ANumber = BaseNode & {
  type: AType.Number;
  value: Token;
};

export type ABinOperation = BaseNode & {
  type: AType.BinaryOperation;
  left: AstNode;
  right: AstNode;
  operator: AOperator;
};

export type AOperator = BaseNode & {
  type: AType.Operator;
  value: Token;
};

export type AError = BaseNode & {
  type: AType.Error;
  value: Token;
  reason: string;
};

export type AstNode = ANumber | AOperator | ABinOperation | AError;
