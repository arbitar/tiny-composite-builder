import { IExtension } from "./IExtension";
import { MethodsOfExts } from "./Utility";

/** Represents any base class type that can be extended */
export type IBaseHint = {};

/**
 * Represents a specific extensible base.
 * 
 * TBaseType will be used to identify which types of extensions can be added. It can and often will
 * simply match the type of the class that implements it, but it does not have to. Extensions
 * needing to access the base will only be able to access methods and properties exposed in the
 * TBaseType interface, however.
 */
export type IBase<TBase extends IBaseHint, EE = null> =
  IBaseHint &
  (
    EE extends Array<any>
    ? (TBase & MethodsOfExts<TBase, EE> & { Extensions: Array<IExtension<TBase>> })
    : TBase & { Extensions: Array<IExtension<TBase>> }
  );
