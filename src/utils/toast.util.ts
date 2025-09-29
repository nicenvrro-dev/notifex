import { useToastStore } from "../store/toast.store";
import type { ToastType, ToastOptions } from "../types/toast.type";

const DEFAULT_DURATION = 3000;

// Core toast function
const createToast = (
  type: ToastType,
  title: string,
  options: ToastOptions = {}
): string => {
  const { addToast } = useToastStore.getState();

  return addToast({
    type,
    title,
    description: options.description,
    action: options.action,
    duration: options.duration ?? DEFAULT_DURATION,
    dedupeKey: options.dedupeKey,
    id: options.id,
    avatar: options.avatar,
  });
};

// Main toast API
export const toast = {
  /**
   * Show an info toast
   */
  info: (title: string, options?: ToastOptions): string => {
    return createToast("info", title, options);
  },

  /**
   * Show a warning toast
   */
  warning: (title: string, options?: ToastOptions): string => {
    return createToast("warning", title, options);
  },

  /**
   * Show a success toast
   */
  success: (title: string, options?: ToastOptions): string => {
    return createToast("success", title, options);
  },

  /**
   * Show an error toast
   */
  error: (title: string, options?: ToastOptions): string => {
    return createToast("error", title, options);
  },

  /**
   * Show an avatar notification toast
   */
  avatar: (
    title: string,
    options: ToastOptions & {
      avatar: { src?: string; name: string; timestamp?: string };
    }
  ): string => {
    return createToast("avatar", title, options);
  },

  /**
   * Dismiss a specific toast by ID, or all toasts if no ID provided
   */
  dismiss: (id?: string): void => {
    const { removeToast, dismissAll } = useToastStore.getState();

    if (id) {
      removeToast(id);
    } else {
      dismissAll();
    }
  },
};
