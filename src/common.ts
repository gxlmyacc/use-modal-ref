import React, { useMemo, useState, useCallback, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
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


export type ModalRefOption<
  P extends ModalType,
  T extends Record<string, any>,
  U,
  C extends Record<string, any> = Record<string, any>
> = {
  custom?: C,
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

  forceVisible?: boolean,
  alwaysResolve?: boolean,
  [key: string]: any
}

export type ModalAction = 'end'|'cancel';

export type ModalType = 'modal'|'drawer'|'popover';

export type ModalTypeItem = {
  visible: string,
  onClose: string,
};

export type ModalTypeMap = {
  // eslint-disable-next-line no-unused-vars
  [key in ModalType]: ModalTypeItem
};

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
export type ModalRef<
  P extends ModalType = 'modal',
  T extends Record<string, any> = Record<string, any>,
  U = any,
  C extends Record<string, any> = Record<string, any>
> = {
  readonly visible: boolean;
  readonly data: Partial<Omit<T, 'onCancel'|'onOK'>> & {
    [key: string]: any
  },
  readonly props: ModalPropsTypeMap[P],
  readonly options: ModalRefOption<P, T, U, C>,
  readonly modalOptions: ModalModalOptions,
  readonly modalPromise: null|Promise<any>|PromiseLike<any>,

  modal(newData: T, options?: ModalModalOptions): Promise<U>;

  endModal: EndModalMethod;
  cancelModal: CancelModalMethod;

  [key: string]: any;
} & {
  [key in keyof C]: C[key];
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

export interface ModalVisibleProps {
  pending?: Promise<any>,
  resolve:(value: any) => any,
  reject: (value: any) => any
}

function useCommonRef<
  P extends ModalType,
  T extends Record<string, any>,
  U = any,
  C extends Record<string, any> = Record<string, any>
>(
  modalType: P,
  ref: React.ForwardedRef<ModalRef<P, T, U, C>>,
  defaultData: Partial<T>|(() => Partial<T>) = {},
  options: ModalRefOption<P, T, U, C> = {},
  deps: React.DependencyList = []
) {
  const [props, setProps] = useState<{
    visible: false | ModalVisibleProps,
    data: T,
    options: ModalRefOption<P, T, U, C>
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

  const modal = useMemo<ModalRef<P, T, U, C>>(
    () => {
      const ret: ModalRef<P, T, U, C> = {
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
            if ($refs.props.visible) {
              if (!$refs.props.visible.pending) {
                reject(new Error('modal is already opened!'));
                return;
              }
              try {
                await $refs.props.visible.pending;
              } catch (error) {
                // empty
              }
              if ($refs.props.visible) return;
            }

            $refs.props.modalOptions = options || {};

            const defaultData = (resolveDefaultData($refs.defaultData) || {});
            let newModalData: T = { ...defaultData };
            if (newData) {
              Object.keys(newData).forEach(key => {
                const value = newData[key];
                if (value === undefined) {
                  return;
                }
                (newModalData as any)[key] = value;
              });
            }

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

            const closeFn = function (before: (next: (() => void)) => any, action: ModalAction) {
              const close = async function () {
                const _close = () => {
                  Object.assign($refs.props, { visible: false, promise: null });
                  setProps({ ...$refs.props });

                  setTimeout(() => {
                    this.afterCloseModal && this.afterCloseModal(this.data, action, this);
                    this.modalOptions.afterCloseModal && this.modalOptions.afterCloseModal(this.data, action, this);
                  });
                };

                if (before) await before(_close);
                else _close();
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
            const visibleRef: ModalVisibleProps = {
              resolve(value: any) {
                return visibleRef.pending = closeFn.call(this, async next => {
                  if (dataEvents.onOK) {
                    const newValue = await dataEvents.onOK(value);
                    if (newValue !== undefined) value = newValue;
                  }
                  if (this.modalOptions.beforeEndModal) {
                    const newValue = await this.modalOptions.beforeEndModal(value);
                    if (newValue !== undefined) value = newValue;
                  }
                  resolve(value);
                  next();
                  return value;
                }, 'end');
              },
              reject(value: any) {
                if (this.modalOptions.alwaysResolve) {
                  this.resolve(value);
                  return value;
                }
                return visibleRef.pending = closeFn.call(this, async next => {
                  if (dataEvents.onCancel) {
                    const newValue = await dataEvents.onCancel(value);
                    if (newValue !== undefined) value = newValue;
                  }
                  if (this.modalOptions.beforeCancelModal) {
                    const newValue = await this.modalOptions.beforeCancelModal(value);
                    if (newValue !== undefined) value = newValue;
                  }
                  reject(value);
                  next();
                  return value;
                }, 'cancel');
              },
            };
            Object.assign($refs.props, {
              data: newModalData,
              visible: visibleRef,
            });
            setProps({ ...$refs.props });

            setTimeout(() => {
              const { init: _init, afterModal, modalOptions } = this;
              if (this.visible) {
                _init && _init.call(this, newModalData, modalOptions);
                afterModal && afterModal.call(this, newModalData, modalOptions);
                modalOptions.afterModal && afterModal.call(this, newModalData, modalOptions);
              }
            });
          });
          $refs.props.promise = promise;
          return promise;
        },
      } as any;

      if (options.custom) {
        Object.assign(ret, options.custom);
      }

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

function mergeModalType(map: Partial<ModalTypeMap>) {
  return Object.assign(modalTypeMap, map);
}

let refContainerSeed = 0;

function createRefComponent<
  T extends React.ForwardRefExoticComponent<React.RefAttributes<
    Record<string, any>
    & any
  >>,
  P extends T extends React.ForwardRefExoticComponent<React.RefAttributes<infer P & any>>
  ? P
  : never,
  R extends T extends React.ForwardRefExoticComponent<React.RefAttributes<P & infer R>>
  ? R
  : never,
>(
  RefComponent: T,
  props?: P | null,
  options: {
    id?: string,
    selector?: string,
    container?: HTMLElement|null|(() => HTMLElement),
    className?: string,
    onRef?: (ref: any, destroy: () => void) => void,
    onAppendContainer?: (container: HTMLElement) => void|boolean,
    onRemoveContainer?: (container: HTMLElement) => void|boolean,
    onDestroyComponent?: (container: HTMLElement) => void|boolean,
    destroyDelay?: number,
  } = {},
): Promise<[ref: R,  destroy: () => void]> {
  let {
    selector, container: _container, id, className, destroyDelay = 50,
    onDestroyComponent, onAppendContainer, onRemoveContainer, onRef,
  } = options;
  return new Promise((resolve, reject) => {
    let resolved = false;
    let destroyed = false;
    let needDestroy = false;
    let container = isFunction(_container) ? _container() : _container;

    if (!container) {
      if (selector) {
        container = document.querySelector(selector) as HTMLElement;
      } else if (id) {
        container = document.getElementById(id) as HTMLElement;
      }
      if (!container) {
        container = document.createElement('div');
        container.classList.add(`ref-component-container-${++refContainerSeed}`);
        if (className) {
          container.classList.add(className);
        }
        if (id) {
          container.id = id;
        }
        if (onAppendContainer?.(container) !== true) {
          document.body.appendChild(container);
        }
        needDestroy = true;
      }
    }

    const destroy = () => {
      if (destroyed) {
        return;
      }
      destroyed = true;
      setTimeout(() => {
        if (onDestroyComponent?.(container as any) !== true) {
          ReactDOM.unmountComponentAtNode(container as any);
          ReactDOM.render(null as any, container as any);
        }
        if (needDestroy && container?.parentNode) {
          if (onRemoveContainer?.(container) !== true) {
            container.parentNode.removeChild(container);
          }
          container = null;
        }
      }, destroyDelay);
    };

    ReactDOM.render(
      React.createElement(RefComponent, {
        ...(props as any || {}),
        ref: r => {
          if (r && !resolved) {
            resolved = true;
            resolve([r, destroy]);
            if (onRef) onRef(r, destroy);
          }
        }
      }),
      container,
    );
  });
}


function showRefModal<
  M extends ModalRef<any, any>,
  D extends M extends ModalRef<any, infer D>
    ? D extends Record<string, any>
      ? D
      : Record<string, any>
    : Record<string, any>,
  U extends M extends ModalRef<any, any, infer U>
    ? U extends never
      ? any
      : U
    : Record<string, any>
>(
  RefModal: React.ForwardRefExoticComponent<
    React.RefAttributes<M>
  >,
  modalData?: D,
  options: Parameters<typeof createRefComponent>[2] & {
    props?: Record<string, any>,
    modalMethod?: string,
    closeWhenUrlChange?: boolean
  } = {},
): Promise<U> {
  return new Promise<U>((resolve, reject) => {
    const modalMethod = options.modalMethod || 'modal';
    createRefComponent(RefModal, options.props, options)
      .then(([ref, destroy]) => {
        (ref[modalMethod] as any)(modalData || {}).then((result: any) => {
          destroy();
          resolve(result);
        }).catch((error: any) => {
          destroy();
          reject(error);
        });
      }).catch(reject);
  });
}

export {
  mergeModalType,
  showRefModal,
  createRefComponent,
};


export default useCommonRef;
