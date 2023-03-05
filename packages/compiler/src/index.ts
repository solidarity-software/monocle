import { AstNode, AType } from "@monocle-lang/parser";
import binaryen from "binaryen";

export function compile(ast: AstNode) {
  const myModule = new binaryen.Module();

  if (ast.type != AType.BinaryOperation) {
    throw new Error("Not supported");
  }

  myModule.addFunction(
    "add",
    binaryen.createType([]),
    binaryen.i32,
    [binaryen.i32],
    myModule.block(null, [
      myModule.local.set(
        2,
        myModule.i32.add(
          myModule.local.get(0, binaryen.i32),
          myModule.local.get(1, binaryen.i32)
        )
      ),
      myModule.return(myModule.local.get(2, binaryen.i32)),
    ])
  );
  myModule.addFunctionExport("add", "add");

  // Optimize the module using default passes and levels
  myModule.optimize();

  // Validate the module
  if (!myModule.validate()) throw new Error("validation error");

  // Generate text format and binary
  const wasmData = myModule.emitBinary();

  // Example usage with the WebAssembly API
  return new WebAssembly.Module(wasmData);
}
