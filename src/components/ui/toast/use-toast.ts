import { computed, ref, type Ref, type VNode } from 'vue';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000; // Typically, you'd want a much shorter delay

// Define more specific types for actions and toasts
interface ToastProps {
  id?: string;
  title?: string | VNode;
  description?: string | VNode;
  variant?: 'default' | 'destructive';
  action?: VNode; // Assuming action is a VNode for custom components
  [key: string]: any; // Allow other props
}

interface ToastInternal extends ToastProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AddToastAction {
  type: typeof actionTypes.ADD_TOAST;
  toast: ToastInternal;
}

interface UpdateToastAction {
  type: typeof actionTypes.UPDATE_TOAST;
  toast: Partial<ToastInternal> & { id: string };
}

interface DismissToastAction {
  type: typeof actionTypes.DISMISS_TOAST;
  toastId?: string;
}

interface RemoveToastAction {
  type: typeof actionTypes.REMOVE_TOAST;
  toastId?: string;
}

type ToastAction = AddToastAction | UpdateToastAction | DismissToastAction | RemoveToastAction;

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST' as const,
  UPDATE_TOAST: 'UPDATE_TOAST' as const,
  DISMISS_TOAST: 'DISMISS_TOAST' as const,
  REMOVE_TOAST: 'REMOVE_TOAST' as const,
};

let count = 0;

function genId(): string {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, number>();

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return;

  const removalTaskTimeoutId = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, Number(removalTaskTimeoutId));
}

interface ToastState {
  toasts: ToastInternal[];
}

const state: Ref<ToastState> = ref({
  toasts: [],
});

function dispatch(action: ToastAction) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      state.value.toasts = [action.toast, ...state.value.toasts].slice(
        0,
        TOAST_LIMIT,
      );
      break;

    case actionTypes.UPDATE_TOAST:
      state.value.toasts = state.value.toasts.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t,
      ) as ToastInternal[];
      break;

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.value.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      state.value.toasts = state.value.toasts.map((t) =>
        t.id === toastId || toastId === undefined
          ? {
              ...t,
              open: false,
            }
          : t,
      );
      break;
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) state.value.toasts = [];
      else
        state.value.toasts = state.value.toasts.filter(
          (t) => t.id !== action.toastId,
        );
      break;
  }
}

interface UseToastReturn {
  toasts: Ref<ToastInternal[]>;
  toast: (props: ToastProps) => { id: string; dismiss: () => void; update: (props: Partial<ToastProps>) => void };
  dismiss: (toastId?: string) => void;
}

function useToast(): UseToastReturn {
  return {
    toasts: computed(() => state.value.toasts),
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

function toast(props: ToastProps) {
  const id = genId();

  const update = (updateProps: Partial<ToastProps>) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...updateProps, id },
    });

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    } as ToastInternal, // Cast to ToastInternal
  });

  return {
    id,
    dismiss,
    update,
  };
}

export { toast, useToast };
export type { ToastProps }; // Exporting ToastProps for external use if needed
