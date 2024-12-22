import { IExtension, IBase } from "../src";

export interface IMyBase {
  funcBase(): "Base"
}

export class MyBase
implements IBase<MyBase>
{
  constructor(public Extensions: IExtension<MyBase>[]) {}

  /**
   * Base
   */
  funcBase(): "Base" {
    return "Base";
  }
}
