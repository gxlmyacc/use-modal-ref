/// <reference types="react" />
import { ModalRefOption } from './common';
declare function useModalRef<T extends Partial<any>, U = any>(ref: React.Ref<any>, defaultData?: Partial<T> | (() => Partial<T>), options?: ModalRefOption<'modal', T, U>, deps?: React.DependencyList): {
    modal: import("./common").ModalRef<"modal", T, U>;
    data: Partial<Omit<T, "onOK" | "onCancel">> & {
        [key: string]: any;
    };
    setData: (newData: T | ((data: T) => T)) => void;
};
export default useModalRef;
