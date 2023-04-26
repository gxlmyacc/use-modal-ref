import React from 'react';
declare type EndModalMethod = (result?: any, onDone?: () => void) => Promise<void>;
declare type CancelModalMethod = (ex?: any, onDone?: () => void) => Promise<void>;
export declare type ModalRefOption<P extends ModalType, T, U> = {
    beforeModal?: (newData: Partial<T>, pause: (result: any, isError?: boolean) => void, options: Record<string, any>) => void | Partial<T> | Promise<void | Partial<T>>;
    init?: (newData: T, options: Record<string, any>) => void | Promise<void>;
    beforeCloseModal?: (next: (ok: any) => void, action: ModalAction, modal: ModalRef<P, T, U>) => void | Promise<void>;
    afterCloseModal?: (newData: T, action: ModalAction, modal: ModalRef<P, T, U>) => void | Promise<void>;
    [key: string]: any;
};
export declare type ModalModalOptions = {
    afterModal?: (newData: any, options?: ModalModalOptions) => void;
    beforeCloseModal?: (next: (ok: any) => void, action: ModalAction) => void | Promise<void>;
    beforeEndModal?: (value?: any) => Promise<void>;
    beforeCancelModal?: (reason?: any) => Promise<void>;
    alwaysResolve?: boolean;
    [key: string]: any;
};
export declare type ModalAction = 'end' | 'cancel';
export declare type ModalType = 'modal' | 'drawer' | 'popover';
export declare type ModalTypeMap = Record<string, {
    visible: string;
    onClose: string;
}>;
export declare type ModalPropsTypeMap = {
    'modal': {
        visible: boolean;
        onCancel: () => void;
    };
    'drawer': {
        open?: boolean;
        onClose?: () => void;
    };
    'popover': {
        visible: boolean;
        onClose: () => void;
    };
};
export interface ModalRef<P extends ModalType, T, U = any> {
    readonly visible: boolean;
    readonly data: Partial<Omit<T, 'onCancel' | 'onOK'>> & {
        [key: string]: any;
    };
    readonly props: ModalPropsTypeMap[P];
    readonly options: ModalRefOption<P, T, U>;
    readonly modalOptions: ModalModalOptions;
    readonly modalPromise: null | Promise<any> | PromiseLike<any>;
    modal(newData: T, options?: ModalModalOptions): Promise<U>;
    endModal: EndModalMethod;
    cancelModal: CancelModalMethod;
    [key: string]: any;
}
export interface ModalResult<P extends ModalType, T = Partial<any>> {
    modal: ModalRef<P, ModalData>;
    data: T;
}
export interface ModalData extends Partial<any> {
    onOK?: (data: any) => any;
    onCancel?: (data: any) => any;
    [key: string]: any;
}
declare function useCommonRef<P extends ModalType, T, U = any>(modalType: P, ref: React.Ref<any>, defaultData?: Partial<T> | (() => Partial<T>), options?: ModalRefOption<P, T, U>, deps?: React.DependencyList): {
    modal: ModalRef<P, T, U>;
    data: Partial<Omit<T, "onOK" | "onCancel">> & {
        [key: string]: any;
    };
    setData: (newData: T | ((data: T) => T)) => void;
};
declare function mergeModalType(map: ModalTypeMap): ModalTypeMap;
export { mergeModalType };
export default useCommonRef;
