export function areSame(a: any, b: any): boolean {
  for (const property in a) {
    if (a[property] !== b[property]) {
      return false;
    }
  }
  return true;
}
