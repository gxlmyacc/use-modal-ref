import { ModalRefOption } from './common';
declare function useDrawerRef<T extends Record<string, any>, U = any, C extends Record<string, any> = {}>(ref: React.Ref<any>, defaultData?: Partial<T> | (() => Partial<T>), options?: ModalRefOption<'drawer', T, U, C>, deps?: React.DependencyList): {
    modal: import("./common").ModalRef<"drawer", T, U, C>;
    data: Partial<Omit<T, "onCancel" | "onOK">> & {
        [key: string]: any;
    };
    setData: (newData: T | ((data: T) => T)) => void;
};
export default useDrawerRef;
