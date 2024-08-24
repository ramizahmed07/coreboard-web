export function arePagesEmpty(arr: any) {
  // [{name:"Page", page:[]} ]
  for (const page of arr) {
    for (const obj of page.page) {
      if (Object.keys(obj).length > 0) {
        return false; // If any object has properties, return false
      }
    }
  }
  return true; // All objects are empty
}
