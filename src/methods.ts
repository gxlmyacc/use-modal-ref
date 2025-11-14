import React from 'react';
import ReactDOM from 'react-dom';
import { isFunction } from './utils';
import type { ModalRef, ModalModalOptions } from './common';
import { getUrlListener } from './url';

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
): Promise<[ref: R, destroy: () => void]> {
  const {
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
        ref: (r) => {
          if (r && !resolved) {
            resolved = true;
            resolve([r, destroy]);
            if (onRef) onRef(r, destroy);
          }
        },
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
    cancelMethod?: string,
    modalMethod?: string,
    modalOptions?: ModalModalOptions
    closeWhenUrlChange?: boolean,
  } = {},
): Promise<U> {
  const {
    modalMethod = 'modal', props, modalOptions,
    closeWhenUrlChange, cancelMethod = 'cancelModal',
    ...restOptions
  } = options;
  return new Promise<U>((resolve, reject) => {
    createRefComponent(RefModal, props, restOptions)
      .then(([ref, destroy]) => {
        let unwatch: () => void | undefined;
        if (closeWhenUrlChange) {
          unwatch = getUrlListener().addListener(
            () => ref[cancelMethod](),
            { once: true },
          );
        }
        (ref[modalMethod] as any)(modalData || {}, modalOptions).then((result: any) => {
          destroy();
          unwatch?.();
          resolve(result);
        }).catch((error: any) => {
          destroy();
          unwatch?.();
          reject(error);
        });
      }).catch(reject);
  });
}

export {
  createRefComponent,
  showRefModal,
};
