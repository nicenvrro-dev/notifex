export type ToastType = "info" | "warning" | "error" | "success" | "avatar";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  description?: string;
  action?: ToastAction;
  dismissAction?: ToastAction;
  duration?: number;
  id?: string;
  dedupeKey?: string;
  avatar?: {
    src?: string;
    name: string;
    timestamp?: string;
  };
}

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  action?: ToastAction;
  dismissAction?: ToastAction;
  duration: number;
  dedupeKey?: string;
  createdAt: number;
  avatar?: {
    src?: string;
    name: string;
    timestamp?: string;
  };
}
