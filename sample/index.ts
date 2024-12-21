import { Builder } from "../src";
import { ExtA, ExtB, ExtC } from "./exts";
import { MyBase } from "./MyBase";

const b1 = Builder.Create(MyBase, b => b);
  console.log(b1.funcBase());

console.log('=====');

const b2 = Builder.Create(MyBase, b => {
  const wa = b.with(ExtA);
  return wa;
});
  console.log(b2.funcBase());
  console.log(b2.FuncA(1));

console.log('=====');

const b3 = Builder.Create(MyBase, b => {
  const wa = b.with(ExtA);
  const wb = wa.with(ExtB, "");
  return wb;
});
  console.log(b3.funcBase());
  console.log(b3.FuncA(1));
  console.log(b3.FuncB(""));
  // console.log(b3.otherFuncB("1"));

console.log('=====');

const b4 = Builder.Create(MyBase, b => b
  .with(ExtB, "")
  .with(ExtC)
);
  console.log(b4.funcBase());
  // console.log(b4.funcA(1));
  console.log(b4.FuncB(""));
  // console.log(b4.otherFuncB("1"));
  console.log(b4.FuncC(""));