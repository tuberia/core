export function isPromise(obj) {
  return obj != null && typeof obj.then === 'function';
}

export function forcePromise(fn, ...args) {
  if (typeof fn !== 'function') {
    throw new Error('forcePromise takes a function as the first parameter');
  }
  let val;
  try {
    val = fn(...args);
  } catch (e) {
    return Promise.reject(e);
  }
  return isPromise(val) ? val : Promise.resolve(val);
}