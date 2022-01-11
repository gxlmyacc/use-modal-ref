import React from 'react';
declare type EndModalMethod = (result?: any, onDone?: () => void) => Promise<void>;
declare type CancelModalMethod = (ex?: any, onDone?: () => void) => Promise<void>;
export declare type ModalRefOption<T, U> = {
    beforeModal?: (newData: Partial<any>, pause: (result: any) => void) => any;
    init?: (newData: Partial<any>) => void;
    beforeCloseModal?: (next: (ok: any) => void, action: ModalAction, modal: ModalRef<T, U>) => void;
    afterCloseModal?: (newData: Partial<any>, action: ModalAction, modal: ModalRef<T, U>) => void;
    [key: string]: any;
};
export declare type ModalAction = 'end' | 'cancel';
export interface ModalRef<T extends Partial<any>, U = any> {
    readonly visible: boolean;
    readonly data: T;
    readonly props: {
        visible: boolean;
        onCancel: () => void;
    };
    modal(newData: T): Promise<U>;
    endModal: EndModalMethod;
    cancelModal: CancelModalMethod;
    [key: string]: any;
}
export interface ModalData extends Partial<any> {
    onOK?: (data: any) => any;
    onCancel?: (data: any) => any;
    [key: string]: any;
}
declare function useModalRef<T extends Partial<any> = ModalData, U = any>(ref: React.Ref<any>, defaultData?: Partial<any>, options?: ModalRefOption<T, U>, deps?: React.DependencyList): {
    modal: ModalRef<T, U>;
    data: T;
    setData: (data: T) => void;
};
export default useModalRef;
