import React from 'react';
declare type EndModalMethod = (result?: any, onDone?: () => void) => Promise<void>;
declare type CancelModalMethod = (ex?: any, onDone?: () => void) => Promise<void>;
export declare type ModalRefOption<T, U> = {
    beforeModal?: (newData: Partial<T>, pause: (result: any, isError?: boolean) => void, options: Record<string, any>) => void | Partial<T> | Promise<void | Partial<T>>;
    init?: (newData: T, options: Record<string, any>) => void | Promise<void>;
    beforeCloseModal?: (next: (ok: any) => void, action: ModalAction, modal: ModalRef<T, U>) => void | Promise<void>;
    afterCloseModal?: (newData: T, action: ModalAction, modal: ModalRef<T, U>) => void | Promise<void>;
    [key: string]: any;
};
export declare type ModalAction = 'end' | 'cancel';
export interface ModalRef<T extends Partial<any>, U = any> {
    readonly visible: boolean;
    readonly data: Partial<Omit<T, 'onCancel' | 'onOK'>> & {
        [key: string]: any;
    };
    readonly props: {
        visible: boolean;
        onCancel: () => void;
    };
    modal(newData: T, options?: Record<string, any>): Promise<U>;
    endModal: EndModalMethod;
    cancelModal: CancelModalMethod;
    [key: string]: any;
}
export interface ModalResult<T = Partial<any>> {
    modal: ModalRef<ModalData>;
    data: T;
}
export interface ModalData extends Partial<any> {
    onOK?: (data: any) => any;
    onCancel?: (data: any) => any;
    [key: string]: any;
}
declare function useModalRef<T extends Partial<any>, U = any>(ref: React.Ref<any>, defaultData?: Partial<T> | (() => Partial<T>), options?: ModalRefOption<T, U>, deps?: React.DependencyList): {
    modal: ModalRef<T, U>;
    data: Partial<Omit<T, "onOK" | "onCancel">> & {
        [key: string]: any;
    };
    setData: (data: T) => void;
};
export default useModalRef;
