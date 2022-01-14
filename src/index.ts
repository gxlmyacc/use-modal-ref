import React, { useMemo, useState, useCallback, useImperativeHandle } from 'react';

function resolveDefaultData(data: any) {
  if (!data) return data;
  if (typeof data === 'function') return data();
  return data;
}

const MODAL_EVENTS = ['beforeModal', 'init', 'beforeCloseModal', 'afterCloseModal'];

const DATA_EVENTS = ['onOK', 'onCancel'];

type EndModalMethod = (result?: any, onDone?: () => void) => Promise<void>;
type CancelModalMethod = (ex?: any, onDone?: () => void) => Promise<void>;


export type ModalRefOption<T, U> = {
  beforeModal?: (newData: Partial<any>, pause: (result: any) => void) => any;
  init?: (newData: Partial<any>) => void;
  beforeCloseModal?: (next: (ok: any) => void, action: ModalAction, modal: ModalRef<T, U>) => void;
  afterCloseModal?: (newData: Partial<any>, action: ModalAction, modal: ModalRef<T, U>) => void;

  [key: string]: any
}

export type ModalAction = 'end'|'cancel';

export interface ModalRef<T extends Partial<any>, U = any> {
  readonly visible: boolean;
  readonly data: T,
  readonly props: {
    visible: boolean;
    onCancel: () => void
  }

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

function useModalRef<T extends Partial<any> = ModalData, U = any>(
  ref: React.Ref<any>,
  defaultData: Partial<any> = {},
  options: ModalRefOption<T, U> = {},
  deps: React.DependencyList = []
) {
  const [props, setProps] = useState<{
    visible: false | {
      resolve:(value: any) => any,
      reject: (value: any) => any
        },
    data: T
        }>(() => ({
          visible: false,
          data: resolveDefaultData(defaultData),
        }));

  const modal = useMemo<ModalRef<T, U>>(() => {
    const ret: ModalRef<T, U> = {
      get visible() {
        return Boolean(props.visible);
      },
      get data(): Omit<T, 'onCancel'|'onOK'> {
        return props.data;
      },
      get props() {
        return {
          visible: Boolean(props.visible),
          onCancel: this.cancelModal as CancelModalMethod,
        };
      },

      modal(newData: T = {} as any): Promise<U> {
        return new Promise(async (resolve, reject) => {
          if (props.visible) return;
          if (this.beforeModal) {
            let pause: any = false;
            newData = await this.beforeModal(
              newData,
              (result = 'cancel') => pause = result,
            ) || newData;
            if (pause) {
              return (pause === 'cancel' || pause instanceof Error) ? reject(pause) : resolve(pause);
            }
          }

          newData = { ...newData };
          const dataEvents: {
            [key: string]: (value: any) => any
          } = {};
          DATA_EVENTS.forEach((key: string) => {
            if (!(newData as any)[key]) return;
            dataEvents[key] = (newData as any)[key];
            delete (newData as any)[key];
          });

          const closeFn = async function (cb: () => any, action: ModalAction) {
            const close = function () {
              Object.assign(props, { visible: false });
              setProps({ ...props });

              setTimeout(() => {
                this.afterCloseModal && this.afterCloseModal(this.data, action, this);
              });

              return cb();
            };

            if (this.beforeCloseModal) {
              return this.beforeCloseModal(
                (ok: any) => ((ok !== false) && close()),
                action,
                this,
              );
            }

            return close.call(this);
          };
          Object.assign(props, {
            data: {
              ...(resolveDefaultData(defaultData) || {}),
              ...newData,
            },
            visible: {
              resolve(value: any) {
                return closeFn.call(this, async () => {
                  if (dataEvents.onOK) {
                    const newValue = await dataEvents.onOK(value);
                    if (newValue !== undefined) value = newValue;
                  }
                  return resolve(value);
                }, 'end');
              },
              reject(value: any) {
                return closeFn.call(this, async () => {
                  if (dataEvents.onCancel) {
                    const newValue = await dataEvents.onCancel(value);
                    if (newValue !== undefined) value = newValue;
                  }
                  return reject(value);
                }, 'cancel');
              },
            },
          });
          setProps({ ...props });

          const { _init } = this;
          if (_init) setTimeout(() => _init.call(this, newData));
        });
      },
    } as any;

    ret.endModal = (async function (result?: any, onDone?: () => void) {
      props.visible && (await props.visible.resolve.call(this, result));
      typeof onDone === 'function' && onDone();
    }).bind(ret);

    ret.cancelModal = (async function (ex?: any, onDone?: () => void) {
      props.visible && (await props.visible.reject.call(this, ex || 'cancel'));
      typeof onDone === 'function' && onDone();
    }).bind(ret);

    return ret;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultData, props]);

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
    (data: T) => setProps({ ...props, data }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props],
  );

  return {
    modal,
    data: modal.data,
    setData,
  };
}

export default useModalRef;
