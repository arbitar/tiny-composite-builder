import { IExtension } from "../../types";
import { MyBase } from "../MyBase";

export class ExtB
implements IExtension<MyBase>
{
  constructor (
    public Base: MyBase,
    protected _other: string
  ) {}
  
  /**
   * Ext B
   */
  $FuncB(test: string): "B" {
    return "B";
  }

  otherFuncB(toast: string): "BB" {
    if (this.Base.funcBase() !== "Base") {
      throw new Error("nah");
    }

    return "BB";
  }

  protected protectedFuncB(): "2" {
    return "2"
  }

  private privFuncB(): "b" {
    return "b"
  }
}