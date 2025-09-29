import { useToastStore } from "../store/toast.store";
import type {
  ToastType,
  ToastOptions,
  ToastId,
  AvatarInfo,
} from "../types/toast.type";

const DEFAULT_DURATION = 3000;

/**
 * Internal helper to create and add a toast
 */
const pushToast = (
  type: ToastType,
  title: string,
  options: ToastOptions = {}
): ToastId => {
  const { addToast } = useToastStore.getState();
  const createdAtMs = Date.now(); // Create timestamp for when toast was created
  return addToast({
    type,
    title,
    description: options.description,
    action: options.action,
    duration: options.duration ?? DEFAULT_DURATION,
    dedupeKey: options.dedupeKey,
    id: options.id,
    avatar: options.avatar,
    createdAtMs,
  });
};

export const toast = {
  info: (title: string, opts?: ToastOptions) => pushToast("info", title, opts),
  warning: (title: string, opts?: ToastOptions) =>
    pushToast("warning", title, opts),
  success: (title: string, opts?: ToastOptions) =>
    pushToast("success", title, opts),
  error: (title: string, opts?: ToastOptions) =>
    pushToast("error", title, opts),

  avatar: (title: string, opts: ToastOptions & { avatar: AvatarInfo }) =>
    pushToast("avatar", title, opts),

  dismiss: (id?: ToastId) => {
    const { removeToast, dismissAll } = useToastStore.getState();
    if (id) {
      removeToast(id); // Remove a specific toast
    } else {
      dismissAll(); // Dismiss all toasts
    }
  },
};
