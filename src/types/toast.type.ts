export type ToastId = string;

export type ToastType = "info" | "warning" | "error" | "success" | "avatar";

export type ToastActionVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "muted"
  | "custom"; // full override w/ className

export interface ToastAction {
  /** Visible label of the button */
  label: string;

  /** Callback triggered on click */
  onClick: () => void | Promise<void>;

  /** Dismiss toast automatically after click (default: true) */
  dismissOnClick?: boolean;
  
  /** Predefined styling variant */
  variant?: ToastActionVariant;
  
  /** Extra classes (mainly for "custom") */
  className?: string;
}


export interface AvatarInfo {
  src?: string;
  name: string;
  timestamp?: string;
}


export interface ToastOptions {
  description?: string;
  action?: ToastAction;
  duration?: number;
  id?: ToastId;
  dedupeKey?: string;
  avatar?: AvatarInfo;
}

export interface Toast extends Required<Pick<ToastOptions, "duration">> {
  id: ToastId;
  type: ToastType;
  title: string;
  createdAtMs: number;
  description?: string;
  action?: ToastAction;
  dedupeKey?: string;
  avatar?: AvatarInfo;
}
