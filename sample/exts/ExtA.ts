import { IExtension } from "../../types";
import { MyBase } from "../MyBase";

export class ExtA
implements IExtension<MyBase>
{
  constructor (public Base: MyBase) {}

  /**
   * Ext A
   */
  $FuncA(toast: number): "A" {
    return "A";
  }
}