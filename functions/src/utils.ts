/**
 * Enforce statically that a given string is a property of a given type.
 * @param name property name
 */
export const propertyOf = <TObj>(name: keyof TObj): string => name;

/**
 * Enforce statically that multiple strings are all properties of a given type.
 * @param name property name
 */
export const propertiesOf = <TObj>(...name: Array<keyof TObj>): string[] => name;

/**
 * Modify the object to remove any "undefined" properties. Returns a reference to the object.
 * @param obj object
 */
export function sanitizeForDb(obj: any): any {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      sanitizeForDb(obj[key]);
    } else if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}


export function delayPromise(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function delayPromiseThenable<T>(ms: number): (value: T) => Promise<T> {
  return (value: T) => {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
  }
}
