/// <reference types="react" />
import { ModalRefOption } from './common';
declare function useDrawerRef<T, U = any>(ref: React.Ref<any>, defaultData?: Partial<T> | (() => Partial<T>), options?: ModalRefOption<'drawer', T, U>, deps?: React.DependencyList): {
    modal: import("./common").ModalRef<"drawer", T, U, Record<string, any>>;
    data: Partial<Omit<T, "onOK" | "onCancel">> & {
        [key: string]: any;
    };
    setData: (newData: T | ((data: T) => T)) => void;
};
export default useDrawerRef;
