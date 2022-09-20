import useCommonRef, { ModalRefOption } from './common';

function usePopoverRef<T, U = any>(
  ref: React.Ref<any>,
  defaultData: Partial<T>|(() => Partial<T>) = {},
  options: ModalRefOption<'popover', T, U> = {},
  deps: React.DependencyList = []
) {
  return useCommonRef('popover', ref, defaultData, options, deps);
}

export default usePopoverRef;
