import React, { useMemo, useState, useCallback, useImperativeHandle } from 'react';
import { isFunction } from './utils';

function resolveDefaultData(data: any) {
  if (!data) return data;
  if (isFunction(data)) return data();
  return data;
}

const MODAL_EVENTS = ['beforeModal', 'init', 'afterModal', 'beforeCloseModal', 'afterCloseModal'];

const DATA_EVENTS = ['onOK', 'onCancel'];

type EndModalMethod = (result?: any, onDone?: () => void) => Promise<void>;
type CancelModalMethod = (ex?: any, onDone?: () => void) => Promise<void>;


export type ModalRefOption<P extends ModalType, T, U> = {
  beforeModal?: (
    newData: Partial<T>,
    pause: (result: any, isError?: boolean) => void, options: Record<string, any>
  ) => void | Partial<T> | Promise<void | Partial<T>>;
  afterModal?: (newData: any, options?: ModalModalOptions) => void,
  init?: (newData: T, options: Record<string, any>) => void | Promise<void>;
  beforeCloseModal?: (next: (ok: any) => void, action: ModalAction, modal: ModalRef<P, T, U>) => void | Promise<void>;
  afterCloseModal?: (newData: T, action: ModalAction, modal: ModalRef<P, T, U>) => void | Promise<void>;

  [key: string]: any
}

export type ModalModalOptions = {
  modalDataEvent?: boolean,
  afterModal?: (newData: any, options?: ModalModalOptions) => void,
  beforeCloseModal?: (next: (ok: any) => void, action: ModalAction) => void | Promise<void>,
  beforeEndModal?: (value?: any) => Promise<any>,
  beforeCancelModal?: (reason?: any) => Promise<any>,
  afterCloseModal?: (newData: any, action: ModalAction) => void | Promise<void>;

  alwaysResolve?: boolean,
  [key: string]: any
}

export type ModalAction = 'end'|'cancel';

export type ModalType = 'modal'|'drawer'|'popover';

export type ModalTypeMap = Record<string, {
  visible: string,
  onClose: string,
}>;

const modalTypeMap: ModalTypeMap = {
  modal: {
    visible: 'visible',
    onClose: 'onCancel',
  },
  drawer: {
    visible: 'visible',
    onClose: 'onClose',
  },
  popover: {
    visible: 'visible',
    onClose: 'onClose',
  },
};

export type ModalPropsTypeMap = {
  'modal': {
    visible: boolean,
    onCancel: () => void,
  },
  'drawer': {
    open?: boolean;
    onClose?: () => void,
  },
  'popover': {
    visible: boolean,
    onClose: () => void,
  },
};
export interface ModalRef<P extends ModalType, T, U = any> {
  readonly visible: boolean;
  readonly data: Partial<Omit<T, 'onCancel'|'onOK'>> & {
    [key: string]: any
  },
  readonly props: ModalPropsTypeMap[P],
  readonly options: ModalRefOption<P, T, U>,
  readonly modalOptions: ModalModalOptions,
  readonly modalPromise: null|Promise<any>|PromiseLike<any>,

  modal(newData: T, options?: ModalModalOptions): Promise<U>;

  endModal: EndModalMethod;
  cancelModal: CancelModalMethod;

  [key: string]: any;
}

export interface ModalResult<P extends ModalType, T = Partial<any>> {
  modal: ModalRef<P, ModalData>,
  data: T,
}

export interface ModalData extends Partial<any> {
  onOK?: (data: any) => any;
  onCancel?: (data: any) => any;

  [key: string]: any;
}

function useCommonRef<P extends ModalType, T, U = any>(
  modalType: P,
  ref: React.Ref<any>,
  defaultData: Partial<T>|(() => Partial<T>) = {},
  options: ModalRefOption<P, T, U> = {},
  deps: React.DependencyList = []
) {
  const [props, setProps] = useState<{
    visible: false | {
      resolve:(value: any) => any,
      reject: (value: any) => any
        },
    data: T,
    options: ModalRefOption<P, T, U>
    modalOptions: ModalModalOptions,
    promise: null|Promise<any>|PromiseLike<any>,
        }>(() => ({
          visible: false,
          data: resolveDefaultData(defaultData),
          options: {},
          modalOptions: {},
          promise: null,
        }));

  const [$refs] = useState({ } as { props: typeof props, defaultData: typeof defaultData });
  $refs.props = props;
  $refs.defaultData = defaultData;

  const modal = useMemo<ModalRef<P, T, U>>(
    () => {
      const ret: ModalRef<P, T, U> = {
        get visible() {
          return Boolean($refs.props.visible);
        },
        get data(): Omit<T, 'onCancel'|'onOK'> {
          return $refs.props.data;
        },
        get props() {
          const map = modalTypeMap[modalType];
          let visibleKey = this.options.visibleKey || map.visible;
          return {
            [visibleKey]: Boolean($refs.props.visible),
            [map.onClose]: this.cancelModal as CancelModalMethod,
          };
        },
        get modalPromise() {
          return $refs.props.promise;
        },
        get options() {
          return $refs.props.options;
        },
        get modalOptions() {
          return $refs.props.modalOptions;
        },

        modal(newData: Partial<T> = {}, options: ModalModalOptions = {}): Promise<U> {
          const promise = new Promise<U>(async (resolve, reject) => {
            if ($refs.props.visible) return;
            $refs.props.modalOptions = options || {};

            const defaultData = (resolveDefaultData($refs.defaultData) || {});
            let newModalData: T = { ...defaultData, ...newData };

            if (this.beforeModal) {
              let pauseResult: any;
              let pause = false;
              let isError = false;
              const result = await this.beforeModal(
                newModalData,
                (result: any, _isError = false) => {
                  pause = true;
                  pauseResult = result;
                  isError = _isError;
                },
                options
              ) || newModalData;
              if (result && result !== newModalData) newModalData = { ...defaultData, ...result };

              if (pause) {
                const checkIsError = (v: any) => {
                  if (v === 'cancel'
                || v instanceof Error
                || isError) {
                    return true;
                  }
                  if (v && v.head) {
                    if (v.head.status && v.head.status !== 'Y') return true;
                    if (v.head.code && v.head.code !== '00000000') return true;
                  }
                  if (v && v.success === false) return true;
                  return false;
                };
                return checkIsError(pauseResult) ? reject(pauseResult) : resolve(pauseResult);
              }
            }

            const dataEvents: Record<string, (value: any) => any> = {};
            if (this.modalOptions.modalDataEvent) {
              DATA_EVENTS.forEach((key: string) => {
                if (!(newModalData as any)[key]) return;
                dataEvents[key] = (newModalData as any)[key];
                delete (newModalData as any)[key];
              });
            }

            const closeFn = function (before: () => any, action: ModalAction) {
              const close = async function () {
                before && (await before());

                Object.assign($refs.props, { visible: false, promise: null });
                setProps({ ...$refs.props });

                setTimeout(() => {
                  this.afterCloseModal && this.afterCloseModal(this.data, action, this);
                  this.modalOptions.afterCloseModal && this.modalOptions.afterCloseModal(this.data, action, this);
                });
              };

              const modalClose = () => {
                if (this.modalOptions.beforeCloseModal) {
                  return this.modalOptions.beforeCloseModal(
                    (ok: any) => ((ok !== false) && close.call(this)),
                    action,
                  );
                }
                return close.call(this);
              };

              if (this.beforeCloseModal) {
                return this.beforeCloseModal(
                  (ok: any) => ((ok !== false) && modalClose.call(this)),
                  action,
                  this,
                );
              }

              return modalClose.call(this);
            };
            Object.assign($refs.props, {
              data: newModalData,
              visible: {
                resolve(value: any) {
                  return closeFn.call(this, async () => {
                    if (dataEvents.onOK) {
                      const newValue = await dataEvents.onOK(value);
                      if (newValue !== undefined) value = newValue;
                    }
                    if (this.modalOptions.beforeEndModal) {
                      const newValue = await this.modalOptions.beforeEndModal(value);
                      if (newValue !== undefined) value = newValue;
                    }
                    resolve(value);
                    return value;
                  }, 'end');
                },
                reject(value: any) {
                  if (this.modalOptions.alwaysResolve) {
                    this.resolve(value);
                    return value;
                  }
                  return closeFn.call(this, async () => {
                    if (dataEvents.onCancel) {
                      const newValue = await dataEvents.onCancel(value);
                      if (newValue !== undefined) value = newValue;
                    }
                    if (this.modalOptions.beforeCancelModal) {
                      const newValue = await this.modalOptions.beforeCancelModal(value);
                      if (newValue !== undefined) value = newValue;
                    }
                    reject(value);
                    return value;
                  }, 'cancel');
                },
              },
            });
            setProps({ ...$refs.props });

            setTimeout(() => {
              const { init: _init, afterModal, modalOptions } = this;
              if (this.visible) {
                _init && _init.call(this, newData, modalOptions);
                afterModal && afterModal.call(this, newData, modalOptions);
                modalOptions.afterModal && afterModal.call(this, newData, modalOptions);
              }
            });
          });
          $refs.props.promise = promise;
          return promise;
        },
      } as any;

      ret.endModal = (async function (result?: any, onDone?: () => void) {
        const ret = $refs.props.visible && (await $refs.props.visible.resolve.call(this, result));
        isFunction(onDone) && onDone();
        return ret;
      }).bind(ret);

      ret.cancelModal = (async function (ex?: any, onDone?: () => void) {
        const ret = $refs.props.visible && (await $refs.props.visible.reject.call(this, ex || 'cancel'));
        isFunction(onDone) && onDone();
        return ret;
      }).bind(ret);

      return ret;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [$refs]
  );

  useImperativeHandle(ref, () => modal, [modal]);

  useMemo(() => {
    MODAL_EVENTS.forEach(eventName => {
      const cb = options[eventName];
      if (cb) (modal as any)[eventName] = cb;
      else delete (modal as any)[eventName];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, options, ...deps]);

  const setData = useCallback(
    (newData: T|((data: T) => T)) => {
      if (isFunction(newData)) {
        return setProps(props => ({
          ...props,
          data: {
            ...props.data,
            ...(newData as any)(props.data)
          }
        }));
      }
      return setProps({ ...$refs.props, data: { ...$refs.props.data, newData } });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [$refs],
  );

  return {
    modal,
    data: modal.data,
    setData,
  };
}

function mergeModalType(map: ModalTypeMap) {
  return Object.assign(modalTypeMap, map);
}

export {
  mergeModalType
};


export default useCommonRef;
