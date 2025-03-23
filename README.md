# tiny-composite-builder

A tiny library that gives you a builder pattern to set up your own composite classes by adding
extension classes to a base class. Some of the extension's methods are added to the created object.

This is easy enough in vanilla JS, so the value of this is mostly in TypeScript. It's fully typed.

The relatively dynamic-seeming objects you create by using the builder will result in a fully typed
base object that is aware of its extensions, their methods, etc. You basically won't be able to
tell it was hacked together behind the scenes.

Um, let me just show you.

## Examples

### Simple Example

Extensions are (and remain) their own sovereign classes, and can maintain their own internal state.

Methods in the extension, however, have 'forwarders' added to the base class when the builder
constructs it. You can control the condition by which methods are forwarded on the base class in
this manner, but by default, it will forward any public method that starts with a dollar sign ($).

```ts
class MyBase implements IBase<MyBase> {
  constructor(public Extensions: IExtension<MyBase>[]) {}
  FuncBase() { return "Base" }
}

class ExtA implements IExtension<MyBase> {
  constructor (public Base: MyBase) {}
  $FuncA() { return "A" }
}

class ExtB implements IExtension<MyBase> {
  constructor (public Base: MyBase, private _output: string) {}
  $FuncB() { return this._output }
}

const built = Builder.Create(MyBase, b => b
  .with(ExtA)
  .with(ExtB, "B")
);

console.log( built.FuncBase() );  // "Base"
console.log( built.FuncA() );     // "A"
console.log( built.FuncB() );     // "B"
```

### Cross-extension access

Extensions can check-for and access other extensions, because the base is always given a list of
all extensions upon construction. This, too, is fully typed.

They can access all the public properties and methods of other extensions, not just the ones with
forwarders present on the base class.

```ts
class MyBase implements IBase<MyBase> {
  constructor(public Extensions: IExtension<MyBase>[]) {}

  FuncBase() { return "Base" }
}

class ExtA implements IExtension<MyBase> {
  constructor (public Base: MyBase) {}
  
  $FuncA() { return "A" }
  getValue() { return "B" }
}

class ExtB implements IExtension<MyBase> {
  constructor (public Base: MyBase, private _output: string) {}

  $FuncB() {
    const extA = this.Base.Extensions.find(b => b instanceof ExtA)
    if (!extA) {
      throw new Error("extension A not loaded")
    }

    return extA.getValue()
  }
}

const built = Builder.Create(MyBase, b => b
  .with(ExtA)
  .with(ExtB)
);

console.log( built.FuncBase() );  // "Base"
console.log( built.FuncA() );     // "A"
console.log( built.FuncB() );     // "B" - via ExtA.getValue()
```
