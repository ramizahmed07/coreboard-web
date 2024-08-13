export function arePagesEmpty(arr: any) {
  for (const subArr of arr) {
    for (const obj of subArr) {
      if (Object.keys(obj).length > 0) {
        return false; // If any object has properties, return false
      }
    }
  }
  return true; // All objects are empty
}
