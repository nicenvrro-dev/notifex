import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore, cleanupToastTimers } from "../store/toast.store";
import { ToastNotification } from "./ToastNotification";

export const ToastContainer: React.FC = () => {
  // Use shallow selector to avoid re-renders when timers change
  const toasts = useToastStore((state) => state.toasts);
  const pauseTimer = useToastStore((state) => state.pauseTimer);
  const resumeTimer = useToastStore((state) => state.resumeTimer);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  // Setup portal root
  useEffect(() => {
    if (typeof window !== "undefined") {
      let container = document.getElementById("toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
      }
      setPortalRoot(container);
    }

    // Cleanup timers on unmount
    return cleanupToastTimers;
  }, []);

  // Pause/resume timers based on interaction
  const handleMouseEnter = useCallback(() => {
    setIsExpanded(true);
    // Pause all timers when hovering
    toasts.forEach((toast) => pauseTimer(toast.id));
  }, [toasts, pauseTimer]);

  const handleMouseLeave = useCallback(() => {
    if (!isFocusWithin) {
      setIsExpanded(false);
      // Resume all timers when leaving
      toasts.forEach((toast) => resumeTimer(toast.id));
    }
  }, [isFocusWithin, toasts, resumeTimer]);

  const handleFocusWithin = useCallback(() => {
    setIsFocusWithin(true);
    setIsExpanded(true);
    // Pause timers when focused
    toasts.forEach((toast) => pauseTimer(toast.id));
  }, [toasts, pauseTimer]);

  const handleBlurWithin = useCallback(
    (e: React.FocusEvent) => {
      const container = e.currentTarget;
      setTimeout(() => {
        if (!container.contains(document.activeElement)) {
          setIsFocusWithin(false);
          setIsExpanded(false);
          // Resume timers when focus leaves
          toasts.forEach((toast) => resumeTimer(toast.id));
        }
      }, 0);
    },
    [toasts, resumeTimer]
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && toasts.length > 0) {
        const { removeToast } = useToastStore.getState();
        // Dismiss the top (newest) toast
        removeToast(toasts[0].id);
      }
    },
    [toasts]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  const shouldExpand = isExpanded || isFocusWithin;

  // Don't render if no toasts or no portal root
  if (toasts.length === 0 || !portalRoot) return null;

  const toastContainer = (
    <div
      className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] flex flex-col-reverse"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocusWithin}
      onBlurCapture={handleBlurWithin}
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      aria-atomic="true"
    >
      {/* Stack indicator when collapsed */}
      {!shouldExpand && toasts.length > 1 && (
        <AnimatePresence>
          <motion.div
            key="stack-indicator"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
            className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm border mb-2 self-end z-20"
            role="status"
            aria-label={`${toasts.length} notifications`}
          >
            {toasts.length} notifications
          </motion.div>
        </AnimatePresence>
      )}

      {/* Toast container */}
      <div className="relative">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => {
            const stackIndex = toasts.length - 1 - index;

            // Calculate stacking properties for deck effect
            const stackOffset = shouldExpand ? 0 : stackIndex * -12;
            const stackScale = shouldExpand ? 1 : Math.max(0.9, 1 - stackIndex * 0.035);
            const stackOpacity = shouldExpand ? 1 : Math.max(0.8, 1 - stackIndex * 0.1);

            // Stagger delay for smoother transitions
            const staggerDelay = shouldExpand ? index * 0.05 : (toasts.length - 1 - index) * 0.05;

            return (
              <motion.div
                key={toast.id}
                layout
                layoutId={`toast-${toast.id}`}
                initial={{
                  opacity: 0,
                  y: 100,
                  scale: 0.7,
                  rotateX: -20,
                  rotateY: 10,
                  x: 0,
                }}
                animate={{
                  opacity: stackOpacity,
                  y: stackOffset,
                  scale: stackScale,
                  rotateX: 0,
                  rotateY: 0,
                  x: 0,
                  zIndex: 1000 + index,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 1,
                    delay: Math.max(0, staggerDelay),
                    duration: 0.6,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: 100,
                  x: 0,
                  scale: 0.6,
                  rotateX: -20,
                  rotateY: 10,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: 0,
                  },
                }}
                className={`${shouldExpand ? "mb-3" : "absolute bottom-0 left-0 w-full"}`}
                style={{
                  transformOrigin: "center bottom",
                  filter: shouldExpand
                    ? "none"
                    : `drop-shadow(0 ${Math.max(6, stackIndex * 3)}px ${Math.max(
                        12,
                        stackIndex * 6
                      )}px rgba(0, 0, 0, ${Math.min(0.3, 0.12 + stackIndex * 0.05)}))`,
                }}
                whileHover={
                  shouldExpand
                    ? {
                        y: stackOffset - 3,
                        scale: stackScale * 1.02,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        },
                      }
                    : undefined
                }
              >
                <ToastNotification toast={toast} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );

  return createPortal(toastContainer, portalRoot);
};
