export type ToastType = "info" | "warning" | "error" | "success" | "avatar";

export type ToastActionVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "muted"
  | "custom"; // use with className override

export interface ToastAction {
  label: string;
  onClick: () => void | Promise<void>;
  /**
   * Dismiss the toast after this action is clicked.
   * Defaults to true.
   */
  dismissOnClick?: boolean;
  /**
   * Controls button color/style. Use "custom" + className for full control.
   */
  variant?: ToastActionVariant;
  /**
   * Extra classes to override/extend styles (esp. when variant === "custom").
   */
  className?: string;
}

export interface ToastOptions {
  description?: string;
  action?: ToastAction;
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
  duration: number;
  dedupeKey?: string;
  createdAt: number;
  avatar?: {
    src?: string;
    name: string;
    timestamp?: string;
  };
}
