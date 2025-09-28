import React from "react";
import { motion } from "framer-motion";
import { X, Info, AlertCircle, type LucideIcon, BadgeCheck, AlertTriangle } from "lucide-react";
import type { Toast } from "../types/toast.type";
import { useToastStore } from "../store/toast.store";
import { getNameInitials } from "../utils/initials.util";

interface ToastNotificationProps {
  toast: Toast;
}

type StylePack = {
  iconBg: string;
  iconColor: string;
  Icon: LucideIcon;
};

const SimpleIcon: React.FC<{ styles: StylePack }> = ({ styles }) => {
  return (
    <div
      className={`w-8 h-8 rounded-full border-2 ${styles.iconBg} ${styles.iconColor} flex items-center justify-center`}
      aria-hidden="true"
    >
      <styles.Icon size={18} />
    </div>
  );
};

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast }) => {
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
          iconBg: "bg-purple-50",
          iconColor: "text-purple-600 border-purple-200",
          Icon: Info,
        };

      case "warning":
        return {
          iconBg: "bg-orange-50",
          iconColor: "text-orange-600 border-orange-200",
          Icon: AlertTriangle,
        };

      case "error":
        return {
          iconBg: "bg-red-50",
          iconColor: "text-red-600 border-red-200",
          Icon: AlertCircle,
        };

      case "success":
        return {
          iconBg: "bg-green-50",
          iconColor: "text-green-600 border-green-200",
          Icon: BadgeCheck,
        };

      case "avatar":
        return {
          iconBg: "bg-gray-600",
          iconColor: "text-white",
          Icon: Info, // Fallback, won't be used for avatar
        };
      default:
        return {
          iconBg: "bg-gray-100",
          iconColor: "text-gray-600",
          Icon: Info,
        };
    }
  };

  const titleClass = (type: Toast["type"]) =>
    [
      "text-sm",
      "mb-1",
      type === "avatar" ? "font-normal text-gray-700" : "font-semibold text-gray-900",
    ].join(" ");

  const styles = getToastStyles(toast.type);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-full relative"
      style={{
        filter: `drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))`,
      }}
      whileHover={{
        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
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
                  {getNameInitials(toast.avatar!.name)}
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
              <h3 className="text-sm font-semibold text-gray-900">{toast.avatar.name}</h3>
              {toast.avatar.timestamp && (
                <span className="text-xs text-gray-400 ml-2">{toast.avatar.timestamp}</span>
              )}
            </div>
          )}

          {toast.title && <h3 className={titleClass(toast.type)}>{toast.title}</h3>}
          {toast.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{toast.description}</p>
          )}

          {/* Action buttons */}
          {(toast.dismissAction || toast.action) && (
            <div className="mt-3 flex items-center gap-4">
              {toast.dismissAction && (
                <button
                  onClick={toast.dismissAction.onClick}
                  className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
                  aria-label={toast.dismissAction.label}
                >
                  {toast.dismissAction.label}
                </button>
              )}

              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className="text-sm text-dark hover:text-primary cursor-pointer transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
                  aria-label={toast.action.label}
                >
                  {toast.action.label}
                </button>
              )}
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
