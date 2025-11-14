import React from 'react';
type EndModalMethod = (result?: any, onDone?: () => void) => Promise<void>;
type CancelModalMethod = (ex?: any, onDone?: () => void) => Promise<void>;
export type ModalRefOption<P extends ModalType, T extends Record<string, any>, U, C extends Record<string, any> = {}> = {
    alwaysResolve?: boolean;
    custom?: C;
    beforeModal?: (newData: Partial<T>, pause: (result: any, isError?: boolean) => void, options: Record<string, any>) => void | Partial<T> | Promise<void | Partial<T>>;
    afterModal?: (newData: any, options?: ModalModalOptions) => void;
    init?: (newData: T, options: Record<string, any>) => void | Promise<void>;
    beforeCloseModal?: (next: (ok: any) => void, action: ModalAction, modal: ModalRef<P, T, U>) => void | Promise<void>;
    afterCloseModal?: (newData: T, action: ModalAction, modal: ModalRef<P, T, U>) => void | Promise<void>;
    [key: string]: any;
};
export type ModalModalOptions = {
    modalDataEvent?: boolean;
    afterModal?: (newData: any, options?: ModalModalOptions) => void;
    beforeCloseModal?: (next: (ok: any) => void, action: ModalAction) => void | Promise<void>;
    beforeEndModal?: (value?: any) => Promise<any>;
    beforeCancelModal?: (reason?: any) => Promise<any>;
    afterCloseModal?: (newData: any, action: ModalAction, modal: ModalRef<any, any, any, any>) => void | Promise<void>;
    forceVisible?: boolean;
    alwaysResolve?: boolean;
    [key: string]: any;
};
export type ModalAction = 'end' | 'cancel';
export type ModalType = 'modal' | 'drawer' | 'popover';
export type ModalTypeItem = {
    visible: string;
    onClose: string;
};
export type ModalTypeMap = {
    [key in ModalType]: ModalTypeItem;
};
export type ModalPropsTypeMap = {
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
export type ModalRef<P extends ModalType = 'modal', T extends Record<string, any> = Record<string, any>, U = any, C extends Record<string, any> = {}> = {
    readonly visible: boolean;
    readonly data: Partial<Omit<T, 'onCancel' | 'onOK'>> & {
        [key: string]: any;
    };
    readonly props: ModalPropsTypeMap[P];
    readonly options: ModalRefOption<P, T, U, C>;
    readonly modalOptions: ModalModalOptions;
    readonly modalPromise: null | Promise<any> | PromiseLike<any>;
    modal(newData: T, options?: ModalModalOptions): Promise<U>;
    endModal: EndModalMethod;
    cancelModal: CancelModalMethod;
    [key: string]: any;
} & {
    [key in keyof C]: C[key];
};
export interface ModalResult<P extends ModalType, T = Partial<any>> {
    modal: ModalRef<P, ModalData>;
    data: T;
}
export interface ModalData extends Partial<any> {
    onOK?: (data: any) => any;
    onCancel?: (data: any) => any;
    [key: string]: any;
}
export interface ModalVisibleProps {
    pending?: Promise<any>;
    resolve: (value: any) => any;
    reject: (value: any) => any;
}
declare function useCommonRef<P extends ModalType, T extends Record<string, any>, U = any, C extends Record<string, any> = {}>(modalType: P, ref: React.ForwardedRef<ModalRef<P, T, U, C>>, defaultData?: Partial<T> | (() => Partial<T>), options?: ModalRefOption<P, T, U, C>, deps?: React.DependencyList): {
    modal: ModalRef<P, T, U, C>;
    data: Partial<Omit<T, "onCancel" | "onOK">> & {
        [key: string]: any;
    };
    setData: (newData: T | ((data: T) => T)) => void;
};
declare function mergeModalType(map: Partial<ModalTypeMap>): ModalTypeMap & Partial<ModalTypeMap>;
export { mergeModalType, };
export default useCommonRef;
