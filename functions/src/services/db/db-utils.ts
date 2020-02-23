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
