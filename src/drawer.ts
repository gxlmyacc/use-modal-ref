import useCommonRef, { ModalRefOption } from './common';

function useDrawerRef<T extends Record<string, any>, U = any>(
  ref: React.Ref<any>,
  defaultData: Partial<T>|(() => Partial<T>) = {},
  options: ModalRefOption<'drawer', T, U> = {},
  deps: React.DependencyList = []
) {
  return useCommonRef('drawer', ref, defaultData, options, deps);
}

export default useDrawerRef;
