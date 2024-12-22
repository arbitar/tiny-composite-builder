import { Builder } from "../src";
import { ExtA, ExtB, ExtC } from "./exts";
import { MyBase } from "./MyBase";

{
  // a plain instance of base works!
  const b1 = Builder.Create(MyBase, b => b);

  console.log(b1.funcBase());
}

console.log('=====');

{
  // a single extension atop the base
  const b2 = Builder.Create(MyBase, b => {
    // check out the type of wa in your editor.
    // it includes information about ExtA.
    const wa = b.with(ExtA);

    return wa;
  });

  console.log(b2.funcBase());
  // this typing info helps it know later that b2.FuncA can be used.
  console.log(b2.FuncA(1));
}

console.log('=====');

{
  // this can be chained. wb is built off the return of wa.
  // this is a bit verbose, so below, you can see how you can just
  // chain the return values off each other.
  const b3 = Builder.Create(MyBase, b => {
    const wa = b.with(ExtA);
    
    // here, you can see that ExtB requires some construction parameters.
    // try removing the empty string... your editor should yell at you (or tsc).
    const wb = wa.with(ExtB, "");
    
    return wb;
  });

  console.log(b3.funcBase());
  console.log(b3.FuncA(1));
  console.log(b3.FuncB(""));

  // ExtB technically has a public function, 'otherFuncB'.
  // this, however, is not projected onto the base, because in its implementation,
  // it did not prefix its method with a $. It can be accessed directly, still, but not
  // right off the base object.
  // your editor should know to complain if you try this, too.
  
  // console.log(b3.otherFuncB("1"));
  console.log(b3.Extensions[1].otherFuncB("1"));
}

console.log('=====');

{
  // here's a condensed form of the above.
  const b4 = Builder.Create(MyBase, b => b
    .with(ExtB, "")
    .with(ExtC)
  );

  console.log(b4.funcBase());

  // ExtA wasn't added, so funcA won't be available, obviously.

  // console.log(b4.FuncA(1));
  
  console.log(b4.FuncB(""));

  // ExtC.$FuncC actually reaches into its own base to find ExtB.
  // if it finds it, it calls it with the same parameter given to it.
  // so, this will actually yield 'B' at runtime.
  // if ExtB is missing, it has prepared a fallback.
  console.log(b4.FuncC(""));
}