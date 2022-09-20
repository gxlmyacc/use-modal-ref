import { useState, useEffect, useCallback } from 'react';
import { ModalRef } from './common';

type ModalRefsOptions = {
  closeWhenUnmount?: boolean;
  unmountExcludes?: string[],
}

type RefsType<T> =  {
  [key in keyof T]: T[key]|ModalRef<any, any>
}

type CreateModalRef<T> = (key: keyof T) => (r: null|ModalRef<any, any>) => any

function useCreateRefs<T extends Record<string, null|any>>(
  refs: T|(() => T),
  options: ModalRefsOptions = {}
):
  [
    $refs: RefsType<T>,
    createModalRef: CreateModalRef<T>
  ] {
  const [_refs] = useState(() => ({ options, unmount: () => {} }));
  _refs.options = options;

  const [$refs] = useState<RefsType<T>>(refs);

  const createModalRef = useCallback<CreateModalRef<T>>(
    key => r => r && (($refs as any)[key] = r),
    [$refs],
  );

  _refs.unmount = useCallback(() => {
    const options = _refs.options;
    Object.keys($refs).forEach(key => {
      if (options.unmountExcludes && options.unmountExcludes.includes(key)) {
        return;
      }
      const ref = ($refs as RefsType<T>)[key] as any;
      if (!ref || !ref.visible || !ref.cancelModal) return;
      try {
        ref.cancelModal();
      } catch (ex) {
        console.error(ex);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [$refs, _refs]);

  if (options.closeWhenUnmount !== false) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => _refs.unmount(), [_refs]);
  }

  return [$refs, createModalRef];
}

export {
  ModalRefsOptions
};

export default useCreateRefs;
