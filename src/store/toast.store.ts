import { create } from "zustand";
import type { Toast, ToastId } from "../types/toast.type";

// Generate unique IDs
const generateId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

interface ToastStore {
  toasts: Toast[];
  timers: Map<ToastId, number>;
  maxToasts: number;

  // Core actions
  addToast: (
    toast: Omit<Toast, "id" | "createdAtMs"> & {
      id?: string;
      createdAtMs: number;
    }
  ) => ToastId;

  removeToast: (id: ToastId) => void;
  dismissAll: () => void;

  // Timer management
  pauseTimer: (id: ToastId) => void;
  resumeTimer: (id: ToastId) => void;
  clearTimer: (id: ToastId) => void;

  // Internal helpers
  _setTimers: (timers: Map<ToastId, number>) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  timers: new Map(),
  maxToasts: 5,

  addToast: (toast) => {
    const state = get();
    const id = toast.id || generateId();
    const createdAtMs = toast.createdAtMs;
    const newToast: Toast = {
      ...toast,
      id,
      createdAtMs,
    };

    // Check for duplicate by dedupeKey
    if (toast.dedupeKey) {
      const existingIndex = state.toasts.findIndex(
        (t) => t.dedupeKey === toast.dedupeKey
      );
      if (existingIndex !== -1) {
        // Update existing toast instead of creating new one
        const existingToast = state.toasts[existingIndex];
        const updatedToast = {
          ...newToast,
          id: existingToast.id,
          createdAtMs,
        };

        const newToasts = [...state.toasts];
        newToasts[existingIndex] = updatedToast;
        set({ toasts: newToasts });

        // Reset timer for updated toast
        state.clearTimer(existingToast.id);
        if (toast.duration && toast.duration > 0) {
          const timerId = window.setTimeout(() => {
            get().removeToast(existingToast.id);
          }, toast.duration);

          state.timers.set(existingToast.id, timerId);
          set({ timers: new Map(state.timers) });
        }

        return existingToast.id;
      }
    }

    // Add to toasts (keep only maxToasts)
    let newToasts = [newToast, ...state.toasts];
    if (newToasts.length > state.maxToasts) {
      const removedToasts = newToasts.slice(state.maxToasts);
      newToasts = newToasts.slice(0, state.maxToasts);

      // Clear timers for removed toasts
      removedToasts.forEach((toast) => state.clearTimer(toast.id));
    }

    set({ toasts: newToasts });

    // Set auto-dismiss timer if duration > 0
    if (toast.duration && toast.duration > 0) {
      const timerId = window.setTimeout(() => {
        get().removeToast(id);
      }, toast.duration);

      state.timers.set(id, timerId);
      set({ timers: new Map(state.timers) });
    }

    return id;
  },

  removeToast: (id) => {
    const state = get();
    state.clearTimer(id);
    set({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    });
  },

  dismissAll: () => {
    const state = get();
    // Clear all timers
    state.timers.forEach((timerId) => clearTimeout(timerId));
    set({
      toasts: [],
      timers: new Map(),
    });
  },

  pauseTimer: (id) => {
    const state = get();
    const timerId = state.timers.get(id);
    if (timerId) {
      clearTimeout(timerId);
      state.timers.delete(id);
      set({ timers: new Map(state.timers) });
    }
  },

  resumeTimer: (id) => {
    const state = get();
    const toast = state.toasts.find((t) => t.id === id);
    if (toast && toast.duration > 0 && !state.timers.has(id)) {
      // Calculate remaining time based on creation time
      const elapsed = Date.now() - toast.createdAtMs;
      const remaining = Math.max(0, toast.duration - elapsed);

      if (remaining > 0) {
        const timerId = window.setTimeout(() => {
          get().removeToast(id);
        }, remaining);

        state.timers.set(id, timerId);
        set({ timers: new Map(state.timers) });
      } else {
        // Timer already expired, remove immediately
        state.removeToast(id);
      }
    }
  },

  clearTimer: (id) => {
    const state = get();
    const timerId = state.timers.get(id);
    if (timerId) {
      clearTimeout(timerId);
      state.timers.delete(id);
      set({ timers: new Map(state.timers) });
    }
  },

  _setTimers: (timers) => {
    set({ timers });
  },
}));

// Cleanup function for component unmount
export const cleanupToastTimers = () => {
  const state = useToastStore.getState();
  state.timers.forEach((timerId) => clearTimeout(timerId));
  state._setTimers(new Map());
};
