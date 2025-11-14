function isFunction(v: any): v is Function {
  return typeof v === 'function';
}

const _hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwnProp(obj: any, key: PropertyKey) {
  return Boolean(obj) && _hasOwnProperty.call(obj, key);
}

function copyOwnProperty(target: any, key: string, source: any): PropertyDescriptor | undefined {
  if (!target || !source) return;
  const d = Object.getOwnPropertyDescriptor(source, key);
  d && Object.defineProperty(target, key, d);
  return d;
}

function copyOwnProperties<
 T extends Record<string, any>,
 S extends Record<string, any>
>(target: T|null, source: S|null, options?: { overwrite?: boolean }): T & S {
  const { overwrite = false } = options || {};
  if (!target || !source) {
    return target as any;
  }
  Object.getOwnPropertyNames(source).forEach((key) => {
    if (hasOwnProp(target, key)) {
      if (!overwrite) {
        return;
      }
    }
    copyOwnProperty(target, key, source);
  });
  return target as any;
}


function throttle<T extends(...args: any[]) => any>(
  fn: T,
  delayTime = 500,
  trail = false): (...args: Parameters<T>) => void {
  let canRun = true;
  let fnArgs: Parameters<T> = [] as any;
  return function (this: any, ...args: Parameters<T>) {
    fnArgs = args;
    if (!canRun) {
      return;
    }
    canRun = false;
    setTimeout(() => {
      canRun = true;
      if (trail) {
        fn.apply(this, fnArgs);
      }
    }, delayTime);

    if (!trail) {
      fn.apply(this, fnArgs);
    }
  };
}


export {
  isFunction,
  copyOwnProperty,
  copyOwnProperties,
  throttle,
};
