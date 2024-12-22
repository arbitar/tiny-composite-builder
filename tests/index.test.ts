import { describe, expect, expectTypeOf, test } from 'vitest';
import { Builder } from '../src/Builder';
import { IBase } from '../types/IBase';
import { IExtension } from '../types/IExtension';

import { MyBase } from "../sample/MyBase";
import { ExtA, ExtB, ExtC } from "../sample/exts";

describe('extension logic', () => {
  test('un-extended base', () => {
    const plain = new MyBase([]);
    const built = Builder.Create(MyBase, b => b);
  
    expect(built.Extensions).toHaveLength(0);

    expectTypeOf(built.funcBase()).toEqualTypeOf(plain.funcBase());

    expect(built.funcBase()).toEqual("Base");
  });
  
  test('once-extended base', () => {
    const plain = new MyBase([]);
    const built = Builder.Create(MyBase, b => b.with(ExtA));
    const plainExtA = new ExtA(new MyBase([]));

    expect(built.Extensions).toHaveLength(1);
    expectTypeOf(built.Extensions[0]).toEqualTypeOf(plainExtA);

    expectTypeOf(built.funcBase()).toEqualTypeOf(plain.funcBase());
    expectTypeOf(built.FuncA(0)).toEqualTypeOf(plainExtA.$FuncA(0));

    expect(built.funcBase()).toEqual("Base");
    expect(built.FuncA(0)).toEqual("A");
  });

  test('twice-extended base', () => {
    const plain = new MyBase([]);
    const built = Builder.Create(MyBase, b => b
      .with(ExtA)
      .with(ExtB, "")
    );
    const plainExtA = new ExtA(new MyBase([]));
    const plainExtB = new ExtB(new MyBase([]), "");

    expect(built.Extensions).toHaveLength(2);
    expectTypeOf(built.Extensions[0]).toEqualTypeOf(plainExtA);
    expectTypeOf(built.Extensions[1]).toEqualTypeOf(plainExtB);

    expectTypeOf(built.funcBase()).toEqualTypeOf(plain.funcBase());
    expectTypeOf(built.FuncA(0)).toEqualTypeOf(plainExtA.$FuncA(0));
    expectTypeOf(built.FuncB("")).toEqualTypeOf(plainExtB.$FuncB(""));

    expect(built.funcBase()).toEqual("Base");
    expect(built.FuncA(0)).toEqual("A");
    expect(built.FuncB("")).toEqual("B");
  });
});

describe('cross-extension awareness', () => {
  test('ext can access base', () => {
    const built = Builder.Create(MyBase, b => b.with(ExtB, ""));

    expect(built.Extensions[0].otherFuncB("")).toEqual("BB");
  });

  test('ext can access other exts', () => {
    const built = Builder.Create(MyBase, b => b
      .with(ExtB, "")
      .with(ExtC)
    );

    expect(built.FuncC("")).toEqual(built.FuncB(""));
  });

  test('exts can detect other missing exts', () => {
    const built = Builder.Create(MyBase, b => b
      .with(ExtC)
    );

    expect(built.FuncC("")).toEqual(built.Extensions[0].getFallback());
  })
})