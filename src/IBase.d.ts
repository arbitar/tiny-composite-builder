import { IExtension } from "./IExtension";
import { MethodsOfExts } from "./Utility";

/** Represents any base class type that can be extended */
export type IBaseHint<
  TBase extends IBaseHint = IBaseHint<any>,
  TExts extends Array<IExtension<TBase>> = Array<IExtension<TBase>>
> = { Extensions: TExts };

/**
 * Represents a specific extensible base.
 * 
 * TBaseType will be used to identify which types of extensions can be added. It can and often will
 * simply match the type of the class that implements it, but it does not have to. Extensions
 * needing to access the base will only be able to access methods and properties exposed in the
 * TBaseType interface, however.
 */
export type IBase<TBaseType extends IBaseHint, EE = null> =
  EE extends Array<any> // any extensions provided?
  // if so, we are our base type... plus our forwarded methods... plus our Extensions list
  ? (TBaseType & MethodsOfExts<TBaseType, EE> & IBaseHint<TBaseType, EE>)
  // otherwise, we are just our base type... with our empty Extensions array
  : (TBaseType & IBaseHint<TBaseType, Array<IExtension<TBaseType>>>);
