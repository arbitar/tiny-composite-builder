import { IBaseHint } from "./IExtensibleBase";

/**
 * Represents an extension class that can be added to TBase.
 * 
 * Suggested: in your implementing extension class, assign base as a constructor parameter:
 * 
 * `constructor(public Base: TBase, ...otherArgs: any){ ... }`
 */
export type IExtension<TBase extends IBaseHint> =
  { Base: TBase }
