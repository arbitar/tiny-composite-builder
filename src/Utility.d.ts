import { IExtension } from "./IExtension";
import { Builder } from "./Builder";
import { IBaseHint } from "./IBase";

/**
 * Represent a union (A|B) as an intersection (A&B)
 */
export type UnionToIntersection<U> = 
  // this is a little above my pay grade. thanks internet.
  // i think.. that because it's inferring I, it has to break apart every possible
  //  union member to get at the type to perform the conditional check, which is
  // then separately represented.
  // but, because all of them are required to satisfy the argument constraint, it
  //  knows to intersect them?
  (U extends any ? (arg: U) => void : never) extends 
  (arg: infer I) => void ? I : never;

/**
 * Represents all the public methods of ALL the Exts provided.
 */
export type MethodsOfExts<TBase extends IBaseHint, EE> =
  EE extends Array<IExtension<TBase>>
  ? UnionToIntersection< // {a(): void}|{b(): void} => {a(): void}&{b(): void}
    MethodsOfExt<TBase,
      ({
        [k in keyof EE as // for every property of the array...
          k extends number // get the real values only (numerically indexed)...
          ? (EE[k] extends IExtension<TBase> ? k : never) // and if they're extensions...
          : never
        ]: EE[k] // snag it!
      })[0] // TODO: figure out why i need this
    >
  >
  : {}; // no methods, because there we no exts. (TODO: verify? was 'never')

/**
 * Represents the prepared extensions of a particular Builder type
 */
export type ExtConsOfBuilder<TBase> =
  TBase extends Builder<infer T, infer EE>
  ? (
    EE extends Array<any>
    ? EE // builder has extensions: these are them!
    : [] // builder doesn't have any extensions yet. blank list.
  ) : never;

/**
 * Represents a function... or a method, in our case.
 * (Also Function is a reserved global type)
 * It returns type T and has arguments U.
 */
export type Method<T = any, U extends [] = any> = (...args: U) => T;

/**
 * Represents an uninstantiated class (a constructor) that constructs T, with arguments U
 */
export type Constructor<T = any, U extends [] = any> = new (...args: U) => T;

/**
 * Represents the type that's constructed by a given constructor T
 */
export type ConstructedType<T> = T extends Constructor<infer U> ? U : never;

/**
 * Get all public methods of a given extension class
 */
export type MethodsOfExt<TBase extends IBaseHint, E> =
  E extends IExtension<TBase> // if this is an extension of the same base interface type...
  ? (
    // a value cannot exist without a valid key type. never is ... never valid.
    // so, we check if each key (method or property) of E matches a permissive method
    // and if so, we index it.
    { [k in keyof E as E[k] extends Method ? k extends `$${infer U}` ? U : never : never]: E[k] }
  ) : never;

/**
 * Represents an existing builder that may have extensions, but with another extension type
 * added, too.
 */
export type BuilderWithExt<
  TBase extends IBaseHint,
  TBuilder,
  TNewExt extends IExtension<TBase>
> =
  TBuilder extends IfEq< // If TBuilder ...
    TBase, // ... has the same base interface type as ...
    BaseOfExt<TNewExt>, // ... the extension we're adding .... 
    Builder<TBase, infer EE> // ... continue, and infer the current extension list EE
  >
  ? (
    EE extends Array<ExtensionConstructionElement<TBase>> // if EE is an array, we have existing extensions.
    ? Builder<TBase, [...EE, ExtensionConstructionElement<TBase, TNewExt>]> // add the new one to the existing list.
    : Builder<TBase, [ExtensionConstructionElement<TBase, TNewExt>]> // ... otherwise, make a new list with this ext.
  ) : never;

/**
 * If A and B are exactly the same type, return T, otherwise never
 */
export type IfEq<A, B, T> =
  // (A extends B) and (B extends A) can only be true if they are identical.
  A extends B
  ? (
    B extends A
    ? T
    : never
  )
  : never;

/**
 * Extract the base interface type of a given extension TExt
 */
export type BaseOfExt<TExt> =
  TExt extends IExtension<infer TBase> ? TBase : never;

/**
 * Element of a builder's extension construction array
 */
export type ExtensionConstructionElement<
  TBase extends IBaseHint,
  TExt extends IExtension<TBase> = IExtension<TBase>
> = 
  [Constructor<TExt>, ConstructorParameters<Constructor<TExt>>];

/**
 * A Builder's extension construction array
 */
export type ExtensionConstructionArray<TBase extends IBaseHint> =
  Array<ExtensionConstructionElement<TBase>>

/**
 * Given an extension construction type array, represent the array of extensions it'd build
 */
export type ConstructedExtensions<
  TBase extends IBaseHint,
  EE
> =
  EE extends ExtensionConstructionArray<TBase>
  ? (
    { [k in keyof EE]: EE[k] extends [Constructor<infer E>, any] ? E : never }
  )
  : never;

/**
 * Given a ConstructorParameters<TClass> as the single type argument,
 * returns the ConstructorParameters list but without the first entry.
 */
export type DropFirst<T extends any[]> =
  T extends [any, ...infer U] ? U : never;