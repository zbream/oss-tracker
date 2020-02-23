/**
 * Enforce statically that a given string is a property of a given type.
 * @param name property name
 */
export const propertyOf = <TObj>(name: Extract<keyof TObj, string>): string => name;

/**
 * Enforce statically that multiple strings are all properties of a given type.
 * @param names property names
 */
export const propertiesOf = <TObj>(...names: Array<Extract<keyof TObj, string>>): string[] => names;

export function delayPromise(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function delayPromiseThenable<T>(ms: number): (value: T) => Promise<T> {
  return (value: T) => {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
  };
}
