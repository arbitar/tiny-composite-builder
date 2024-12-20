import { IExtension } from "../types/IExtension";
import { IExtensibleBase, IExtensibleBaseType } from "../types/IExtensibleBase";
import { ExtConsOfBuilder, Constructor, BuilderWithExt, ConstructedType, DropFirst, ExtensionConstructionArray, ConstructedExtensions } from "../types/Utility";

/**
 * A function that provides a consumer the ability to extend the base with extensions.
 * @typeparam T extends ExtensibleBase: what kind of extensible object are we creating?
 * @typeparam A: original form of the builder
 * @typeparam B: new form of the builder
 */
export type ExtensibleBuilderFunction<
  T extends IExtensibleBaseType,
  A extends ExtensibleBuilder<T>,
  B extends ExtensibleBuilder<T>
> = (b: A) => B;

/**
 * A builder that should produce a base
 * @typeparam T extends ExtensibleBase: what kind of extensible object are we creating?
 * 
 * @example
 * Suggestion: On your base class, add a helper function for creation:
 * ```
 * class MyBase implements IExtensibleBase<MyBase> {
 *   static Create = <TNext extends ExtensibleBuilder<MyBase, any>>(
 *     b: ExtensibleBuilderFunction<MyBase, ExtensibleBuilder<MyBase>, TNext>,
 *     ...args: ConstructorParameters<typeof MyBase>
 *   ) => ExtensibleBuilder.Create(MyBase, b, ...args);
 * }
 * ```
 */
export class ExtensibleBuilder<
  TBase extends IExtensibleBaseType,
  TExtArray extends ExtensionConstructionArray<TBase> = []
>
{
  /**
   * Create a new ExtensibleBase object with optional extensions, added via a builder function.
   * @param builder Builder function that describes the desired extensions for the object
   * @returns New instance of ExtensibleBase object with the requested extensions present
   */
  static Create<
    T extends IExtensibleBaseType,
    B extends ExtensibleBuilder<T, any>,
  >(
    base: Constructor<T>,
    builder: ExtensibleBuilderFunction<T, ExtensibleBuilder<T>, B>,
    ...args: any
  ): IExtensibleBase<T, ConstructedExtensions<T, ExtConsOfBuilder<B>>> {
    let instance = new ExtensibleBuilder<T>(base);
    instance = builder(instance);
    const built = instance.make(...args) as IExtensibleBase<T, ConstructedExtensions<T, ExtConsOfBuilder<B>>>;
    return built;
  }

  private constructor(private _base: Constructor<IExtensibleBase<TBase>>){}
  private _extensions: ExtensionConstructionArray<TBase> = [];

  /**
   * Add a compatible extension to be grafted onto the base.
   * @param extClass Extension class (non-instantiated: use the class name as a value!)
   * @param args Arguments, if any, to pass along to the extension constructor. Do not include the
   * Base instance parameter, this is automatically provided to the extension constructor later.
   * @returns The builder, now aware of this extension
   */
  with<
    TSelf extends ExtensibleBuilder<TBase, TExtArray>,
    TNewExt extends Constructor<IExtension<TBase>>,
    TExtArgs extends DropFirst<ConstructorParameters<TNewExt>>
  >(
    this: TSelf,
    extClass: TNewExt,
    ...args: TExtArgs
  ): BuilderWithExt<TBase, TSelf, ConstructedType<TNewExt>> {
    const newSelf = (this as unknown as BuilderWithExt<TBase, TSelf, ConstructedType<TNewExt>>);
    // const ext = new extClass(newSelf, ...args) as ConstructedType<TNewExt>;
    newSelf._extensions.push([extClass, args]);
    return newSelf;
  }

  private make(...args: any): IExtensibleBase<TBase, ConstructedExtensions<TBase, TExtArray>> {
    const base = new this._base(...args);

    const extensions = this._extensions
      .map(([extClass, extraArgs]) => new extClass(base, ...extraArgs));

    // provide the forwarding functions in the base
    extensions.forEach((e, i) => {
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(e))
        .filter(m => typeof e[m as keyof typeof e] === "function")
        .filter(m => m !== "constructor")
        .filter(m => m.startsWith("$"));

      methods.forEach((m) => {
        (base as any)[m] = (...args: any[]) => 
          (this._extensions as any)[i][m.substring(1)](...args)
      });
    });

    return base as IExtensibleBase<TBase, ConstructedExtensions<TBase, TExtArray>>;
  }
}