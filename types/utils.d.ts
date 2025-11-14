declare function isFunction(v: any): v is Function;
declare function copyOwnProperty(target: any, key: string, source: any): PropertyDescriptor | undefined;
declare function copyOwnProperties<T extends Record<string, any>, S extends Record<string, any>>(target: T | null, source: S | null, options?: {
    overwrite?: boolean;
}): T & S;
declare function throttle<T extends (...args: any[]) => any>(fn: T, delayTime?: number, trail?: boolean): (...args: Parameters<T>) => void;
export { isFunction, copyOwnProperty, copyOwnProperties, throttle, };
