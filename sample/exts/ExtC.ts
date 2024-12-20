import { IExtension } from "../../types";
import { MyBase } from "../MyBase";

export class ExtC
implements IExtension<MyBase>
{
  constructor (public Base: MyBase) {}

  a = 1;
  private val: "C" = "C";

  /**
   * Ext C
   */
  $FuncC(whatever: any): "C" {
    console.log(this.Base);
    if (this.Base.funcBase() != "Base") {
      throw new Error("nah");
    }
    return this.val;
  }
}