import { IExtension } from "../../src";
import { MyBase } from "../MyBase";

type Config = {
  a_required: string
  an_optional: string
}

const Defaults = {
  an_optional: "value" as string
}

export type OptionalConfig<TConfig, TDefaults> = {
  [K in keyof TConfig as K extends keyof TDefaults ? K : never]: TConfig[K]
};

export type RequiredConfig<TConfig, TDefaults> = {
  [K in Exclude<keyof TConfig, keyof TDefaults>]: TConfig[K]
};

// export type UserConfig<TConfig, TDefaults> = {
//   [K in keyof TConfig]:
//     K extends keyof TDefaults ? (TConfig[K]|undefined) : TConfig[K]
// }

export type UserConfig<TConfig, TDefaults> =
  Partial<OptionalConfig<TConfig, TDefaults>>
  & RequiredConfig<TConfig, TDefaults>;

export class ExtB
implements IExtension<MyBase>
{
  constructor (
    public Base: MyBase,
    protected _other: UserConfig<Config, typeof Defaults>
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