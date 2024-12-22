import { IExtension } from "../../src";
import { MyBase } from "../MyBase";
import { ExtB } from "./ExtB";

export class ExtC
implements IExtension<MyBase>
{
  constructor (public Base: MyBase) {}

  private fallback = "C (B was not found)";

  /**
   * Ext C
   */
  $FuncC(whatever: any): string {
    // this ought to never be true.
    if (this.Base.funcBase() != "Base") {
      throw new Error("nah");
    }

    // see if we can grab another extension.
    const extB = this.Base.Extensions.find(e => e instanceof ExtB);
    if (extB) {
      return extB.$FuncB(whatever);
    }
    
    // if the other extension is missing, go with the fallback
    return this.fallback;
  }

  getFallback(): typeof this.fallback {
    return this.fallback;
  }
}