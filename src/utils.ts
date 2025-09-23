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
  const { overwrite = false  } = options || {};
  if (!target || !source) {
    return target as any;
  }
  Object.getOwnPropertyNames(source).forEach(key => {
    if (hasOwnProp(target, key)) {
      if (!overwrite) {
        return;
      }
    }
    copyOwnProperty(target, key, source);
  });
  return target as any;
}

export {
  isFunction,
  copyOwnProperty,
  copyOwnProperties
};
