import { ExtensibleBuilder, ExtensibleBuilderFunction } from "../src";
import { IExtensibleBase } from "../types/IExtensibleBase";

export interface IMyBase {
  funcBase(): "Base"
}

export class MyBase
implements IExtensibleBase<MyBase>
{
  static Create = <TNext extends ExtensibleBuilder<MyBase, any>>(
    b: ExtensibleBuilderFunction<MyBase, ExtensibleBuilder<MyBase>, TNext>,
    ...args: ConstructorParameters<typeof MyBase>
  ) => ExtensibleBuilder.Create(MyBase, b, ...args);

  constructor() {}

  /**
   * Base
   */
  funcBase(): "Base" {
    return "Base";
  }
}
