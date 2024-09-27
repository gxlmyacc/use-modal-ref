import React from 'react';
declare type EndModalMethod = (result?: any, onDone?: () => void) => Promise<void>;
declare type CancelModalMethod = (ex?: any, onDone?: () => void) => Promise<void>;
export declare type ModalRefOption<P extends ModalType, T extends Record<string, any>, U, C extends Record<string, any> = Record<string, any>> = {
    custom?: C;
    beforeModal?: (newData: Partial<T>, pause: (result: any, isError?: boolean) => void, options: Record<string, any>) => void | Partial<T> | Promise<void | Partial<T>>;
    afterModal?: (newData: any, options?: ModalModalOptions) => void;
    init?: (newData: T, options: Record<string, any>) => void | Promise<void>;
    beforeCloseModal?: (next: (ok: any) => void, action: ModalAction, modal: ModalRef<P, T, U>) => void | Promise<void>;
    afterCloseModal?: (newData: T, action: ModalAction, modal: ModalRef<P, T, U>) => void | Promise<void>;
    [key: string]: any;
};
export declare type ModalModalOptions = {
    modalDataEvent?: boolean;
    afterModal?: (newData: any, options?: ModalModalOptions) => void;
    beforeCloseModal?: (next: (ok: any) => void, action: ModalAction) => void | Promise<void>;
    beforeEndModal?: (value?: any) => Promise<any>;
    beforeCancelModal?: (reason?: any) => Promise<any>;
    afterCloseModal?: (newData: any, action: ModalAction) => void | Promise<void>;
    forceVisible?: boolean;
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
export declare type ModalRef<P extends ModalType, T extends Record<string, any>, U = any, C extends Record<string, any> = Record<string, any>> = {
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
declare function useCommonRef<P extends ModalType, T extends Record<string, any>, U = any, C extends Record<string, any> = Record<string, any>>(modalType: P, ref: React.Ref<any>, defaultData?: Partial<T> | (() => Partial<T>), options?: ModalRefOption<P, T, U, C>, deps?: React.DependencyList): {
    modal: ModalRef<P, T, U, C>;
    data: Partial<Omit<T, "onOK" | "onCancel">> & {
        [key: string]: any;
    };
    setData: (newData: T | ((data: T) => T)) => void;
};
declare function mergeModalType(map: ModalTypeMap): ModalTypeMap;
declare function createRefComponent<T extends React.ForwardRefExoticComponent<React.RefAttributes<Record<string, any> & any>>, P extends T extends React.ForwardRefExoticComponent<React.RefAttributes<infer P & any>> ? P : never, R extends T extends React.ForwardRefExoticComponent<React.RefAttributes<P & infer R>> ? R : never>(RefComponent: T, props?: P | null, options?: {
    id?: string;
    selector?: string;
    container?: HTMLElement | null;
    className?: string;
    onAppendContainer?: (container: HTMLElement) => void | boolean;
    onRemoveContainer?: (container: HTMLElement) => void | boolean;
    destoryDelay?: number;
}): Promise<[ref: R, destory: () => void]>;
declare function showRefModal<M extends ModalRef<any, any>, D extends M extends ModalRef<any, infer D> ? D extends Record<string, any> ? D : Record<string, any> : Record<string, any>, U extends M extends ModalRef<any, any, infer U> ? U extends never ? any : U : Record<string, any>>(RefModal: React.ForwardRefExoticComponent<React.RefAttributes<M>>, modalData?: D, options?: Parameters<typeof createRefComponent>[2]): Promise<U>;
export { mergeModalType, showRefModal, createRefComponent, };
export default useCommonRef;
