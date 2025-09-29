import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Info,
  AlertCircle,
  type LucideIcon,
  BadgeCheck,
  CircleAlert,
} from "lucide-react";
import type { Toast } from "../types/toast.type";
import { useToastStore } from "../store/toast.store";
import { extractInitials } from "../utils/initials.util";

interface ToastNotificationProps {
  toast: Toast;
}

type StylePack = {
  iconColor: string;
  iconBorderInner: string;
  iconBorderOuter: string;
  Icon: LucideIcon;
};

const SimpleIcon: React.FC<{ styles: StylePack }> = ({ styles }) => {
  return (
    // Outer border
    <div
      className={`w-10 h-10 rounded-full border-2 ${styles.iconBorderOuter} flex items-center justify-center`}
    >
      {/* Inner Border */}
      <div
        className={`w-8 h-8 rounded-full border-2 ${styles.iconBorderInner} ${styles.iconColor} flex items-center justify-center`}
        aria-hidden="true"
      >
        <styles.Icon size={22} />
      </div>
    </div>
  );
};

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toast,
}) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      removeToast(toast.id);
    }
  };

  const getToastStyles = (type: Toast["type"]): StylePack => {
    switch (type) {
      case "info":
        return {
          iconColor: "text-blue-600 border-blue-200",
          iconBorderInner: "border-blue-100",
          iconBorderOuter: "border-blue-100",
          Icon: Info,
        };

      case "warning":
        return {
          iconColor: "text-orange-600 border-orange-200",
          iconBorderInner: "border-orange-100",
          iconBorderOuter: "border-orange-100",
          Icon: CircleAlert,
        };

      case "error":
        return {
          iconColor: "text-red-600 border-red-200",
          iconBorderInner: "border-red-100",
          iconBorderOuter: "border-red-100",
          Icon: AlertCircle,
        };

      case "success":
        return {
          iconColor: "text-green-600 border-green-200",
          iconBorderInner: "border-green-100",
          iconBorderOuter: "border-green-100",
          Icon: BadgeCheck,
        };

      case "avatar":
        return {
          iconColor: "text-white",
          iconBorderInner: "",
          iconBorderOuter: "",
          Icon: Info, // Fallback, won't be used for avatar
        };
      default:
        return {
          iconColor: "text-gray-600",
          iconBorderInner: "",
          iconBorderOuter: "",
          Icon: Info,
        };
    }
  };

  const titleClass = (type: Toast["type"]) =>
    [
      "text-sm",
      "mb-1",
      type === "avatar"
        ? "font-normal text-gray-700"
        : "font-bold text-gray-900",
    ].join(" ");

  const styles = getToastStyles(toast.type);

  const actionClasses = () => {
    const base =
      "text-sm cursor-pointer transition-colors font-medium focus:outline-none rounded px-1 focus:ring-2";
    const v = toast.action?.variant ?? "default";

    switch (v) {
      case "primary":
        return `${base} text-blue-600 hover:text-blue-700 focus:ring-blue-300`;
      case "success":
        return `${base} text-green-600 hover:text-green-700 focus:ring-green-300`;
      case "warning":
        return `${base} text-orange-600 hover:text-orange-700 focus:ring-orange-300`;
      case "danger":
        return `${base} text-red-600 hover:text-red-700 focus:ring-red-300`;
      case "muted":
        return `${base} text-gray-500 hover:text-gray-700 focus:ring-gray-300`;
      case "custom":
        // rely on className entirely (still keep focus ring fallback minimal)
        return `${base}`;
      case "default":
      default:
        return `${base} text-gray-700 hover:text-gray-900 focus:ring-gray-300`;
    }
  };

  const onActionClick = async () => {
    try {
      await toast.action?.onClick();
    } finally {
      // default: dismiss after click unless explicitly disabled
      if (toast.action?.dismissOnClick !== false) {
        removeToast(toast.id);
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-full relative"
      style={{
        filter: `drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))`,
      }}
      whileHover={{
        boxShadow:
          "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      tabIndex={0}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start">
        {/* Icon or Avatar */}
        {toast.type === "avatar" && toast.avatar ? (
          <div className="relative">
            {toast.avatar.src ? (
              <img
                src={toast.avatar.src}
                alt={toast.avatar.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold text-white">
                  {extractInitials(toast.avatar!.name)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <SimpleIcon styles={styles} />
        )}

        {/* Content */}
        <div className="ml-3 flex-1 pr-2">
          {/* Avatar notification header */}
          {toast.type === "avatar" && toast.avatar && (
            <div className="flex items-center mb-1">
              <h3 className="text-sm font-semibold text-gray-900">
                {toast.avatar.name}
              </h3>
              {toast.avatar.timestamp && (
                <span className="text-xs text-gray-400 ml-2">
                  {toast.avatar.timestamp}
                </span>
              )}
            </div>
          )}

          {toast.title && (
            <h3 className={titleClass(toast.type)}>{toast.title}</h3>
          )}
          {toast.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {toast.description}
            </p>
          )}

          {/* Action buttons */}
          {toast.action && (
            <div className="mt-3">
              {" "}
              <button
                onClick={onActionClick}
                className={`${actionClasses()} ${toast.action.className ?? ""}`}
                aria-label={toast.action.label}
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};
