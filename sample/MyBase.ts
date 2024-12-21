import { IBase } from "../types/IBase";
import { IExtension } from "../types/IExtension";

export interface IMyBase {
  funcBase(): "Base"
}

export class MyBase
implements IBase<MyBase>
{
  constructor(public readonly Extensions: IExtension<MyBase>[]) {}

  /**
   * Base
   */
  funcBase(): "Base" {
    return "Base";
  }
}
