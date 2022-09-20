import { ModalRef } from './common';
declare type ModalRefsOptions = {
    closeWhenUnmount?: boolean;
    unmountExcludes?: string[];
};
declare type RefsType<T> = {
    [key in keyof T]: T[key] | ModalRef<any, any>;
};
declare type CreateModalRef<T> = (key: keyof T) => (r: null | ModalRef<any, any>) => any;
declare function useCreateRefs<T extends Record<string, null | any>>(refs: T | (() => T), options?: ModalRefsOptions): [
    $refs: RefsType<T>,
    createModalRef: CreateModalRef<T>
];
export { ModalRefsOptions };
export default useCreateRefs;
