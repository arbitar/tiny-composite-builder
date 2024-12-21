import { IExtension } from "../types/IExtension";
import { IBase, IBaseHint } from "../types";
import { ExtConsOfBuilder, Constructor, BuilderWithExt, ConstructedType, DropFirst, ExtensionConstructionArray, ConstructedExtensions } from "../types/Utility";

/**
 * A function that provides a consumer the ability to extend the base with extensions.
 * @typeparam T extends ExtensibleBase: what kind of extensible object are we creating?
 * @typeparam A: original form of the builder
 * @typeparam B: new form of the builder
 */
export type BuilderFunction<
  T extends IBaseHint,
  A extends Builder<T>,
  B extends Builder<T>
> = (b: A) => B;

/**
 * A builder that should produce a base
 * @typeparam T extends ExtensibleBase: what kind of extensible object are we creating?
 */
export class Builder<
  TBase extends IBaseHint,
  TExts extends ExtensionConstructionArray<TBase> = []
>
{
  /**
   * Create a new ExtensibleBase object with optional extensions, added via a builder function.
   * @param builder Builder function that describes the desired extensions for the object
   * @returns New instance of ExtensibleBase object with the requested extensions present
   */
  static Create<
    TBase extends IBaseHint<TBase>,
    TBuilder extends Builder<TBase, any>,
  >(
    base: Constructor<TBase>,
    builder: BuilderFunction<TBase, Builder<TBase>, TBuilder>,
    ...args: any
  ): IBase<TBase, ConstructedExtensions<TBase, ExtConsOfBuilder<TBuilder>>> {
    let instance = new Builder<TBase>(base);
    instance = builder(instance);
    const built = instance.make(...args) as IBase<TBase, ConstructedExtensions<TBase, ExtConsOfBuilder<TBuilder>>>;
    return built;
  }

  private constructor(private _base: Constructor<TBase>){}
  private _extensions: ExtensionConstructionArray<TBase> = [];

  /**
   * Add a compatible extension to be grafted onto the base.
   * @param extClass Extension class (non-instantiated: use the class name as a value!)
   * @param args Arguments, if any, to pass along to the extension constructor. Do not include the
   * Base instance parameter, this is automatically provided to the extension constructor later.
   * @returns The builder, now aware of this extension
   */
  with<
    TSelf extends Builder<TBase, TExts>,
    TNewExt extends Constructor<IExtension<TBase>>,
    TExtArgs extends DropFirst<ConstructorParameters<TNewExt>>
  >(
    this: TSelf,
    extClass: TNewExt,
    ...args: TExtArgs
  ): BuilderWithExt<TBase, TSelf, ConstructedType<TNewExt>> {
    const newSelf = (this as unknown as BuilderWithExt<TBase, TSelf, ConstructedType<TNewExt>>);
    newSelf._extensions.push([extClass, args]);
    return newSelf;
  }

  private make(...args: any): IBase<TBase, ConstructedExtensions<TBase, TExts>> {
    const base = new this._base(...args);

    const extensions = this._extensions
      .map(([extClass, extraArgs]) => new extClass(base, ...extraArgs));

    base.Extensions = extensions;

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

    return base as IBase<TBase, ConstructedExtensions<TBase, TExts>>;
  }
}