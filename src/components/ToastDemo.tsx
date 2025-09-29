import React from "react";
import { toast } from "../utils/toast.util";
import { getRelativeTime } from "../utils/time.utils";

export const ToastDemo: React.FC = () => {
  const showInfoToast = () => {
    toast.info("We've just released a new feature", {
      description:
        "Check out the all new dashboard view. Pages and exports now load faster.",
      action: {
        label: "Dismiss",
        variant: "muted",
        onClick() {
          alert("Dismissed!");
        },
      },
    });
  };

  const showWarningToast = () => {
    toast.warning("This project has been unpublished", {
      description:
        "Removing all users has unpublished this project. Add users to republish.",
      action: {
        label: "Undo action",
        onClick() {
          alert("Action undo");
        },
      },
    });
  };

  const showErrorToast = () => {
    toast.error("This project has been unpublished", {
      description:
        "Removing all users has unpublished this project. Add users to republish.",
      action: {
        label: "Undo action",
        onClick() {
          alert("Action undo");
        },
      },
    });
  };

  const showSuccessToast = () => {
    toast.success("Successfully updated profile", {
      description:
        "Your changes have been saved and your profile is live. Your team can make edits.",
      action: {
        label: "Dismiss",
        onClick() {
          alert("Dismissed");
        },
      },
    });
  };

  const showAvatar = () => {
    const now = new Date();
    toast.avatar(
      "I've finished adding my notes. Happy for us to review whenever you're ready!",
      {
        avatar: {
          src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
          name: "Katherine Moss",
          timestamp: getRelativeTime(now),
        },

        action: {
          label: "Dismiss",
          onClick() {
            alert("Dismissed");
          },
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Toast Notifications Demo
          </h1>
          <p className="text-gray-600">
            Click any button below to trigger different toast variants
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={showInfoToast}
            className="px-6 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg cursor-pointer font-medium hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Info Toast
          </button>

          <button
            onClick={showWarningToast}
            className="px-6 py-3 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg cursor-pointer font-medium hover:bg-orange-100 hover:border-orange-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Warning Toast
          </button>

          <button
            onClick={showErrorToast}
            className="px-6 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg cursor-pointer font-medium hover:bg-red-100 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Error Toast
          </button>

          <button
            onClick={showSuccessToast}
            className="px-6 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg cursor-pointer font-medium hover:bg-green-100 hover:border-green-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Success Toast
          </button>

          <button
            onClick={showAvatar}
            className="px-6 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg cursor-pointer font-medium hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Show Avatar
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Toasts will appear in the bottom-right corner and auto-dismiss after
            5 seconds
          </p>
        </div>
      </div>
    </div>
  );
};
