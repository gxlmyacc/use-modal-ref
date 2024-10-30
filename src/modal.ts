import useCommonRef, { ModalRefOption } from './common';

function useModalRef<T extends Record<string, any>, U = any>(
  ref: React.Ref<any>,
  defaultData: Partial<T>|(() => Partial<T>) = {},
  options: ModalRefOption<'modal', T, U> = {},
  deps: React.DependencyList = []
) {
  return useCommonRef('modal', ref, defaultData, options, deps);
}

export default useModalRef;
