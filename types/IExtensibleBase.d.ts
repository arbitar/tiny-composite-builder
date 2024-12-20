import { MethodsOfExts } from "./Utility";

/** Represents any base class type that can be extended */
export type IExtensibleBaseType = {};

/**
 * Represents a specific extensible base.
 * 
 * TBaseType will be used to identify which types of extensions can be added. It can and often will
 * simply match the type of the class that implements it, but it does not have to. Extensions
 * needing to access the base will only be able to access methods and properties exposed in the
 * TBaseType interface, however.
 */
export type IExtensibleBase<TBaseType extends IExtensibleBaseType, EE = null> =
  IExtensibleBaseType &
  (
    EE extends Array<any>
    ? (TBaseType & MethodsOfExts<TBaseType, EE>)
    : TBaseType
  );
