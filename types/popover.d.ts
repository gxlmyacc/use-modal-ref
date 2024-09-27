/// <reference types="react" />
import { ModalRefOption } from './common';
declare function usePopoverRef<T, U = any>(ref: React.Ref<any>, defaultData?: Partial<T> | (() => Partial<T>), options?: ModalRefOption<'popover', T, U>, deps?: React.DependencyList): {
    modal: import("./common").ModalRef<"popover", T, U, Record<string, any>>;
    data: Partial<Omit<T, "onOK" | "onCancel">> & {
        [key: string]: any;
    };
    setData: (newData: T | ((data: T) => T)) => void;
};
export default usePopoverRef;
