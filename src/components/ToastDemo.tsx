import React from "react";
import { toast } from "../utils/toast.util";

export const ToastDemo: React.FC = () => {
  const showInfoToast = () => {
    toast.info("We've just released a new feature", {
      description: "Check out the all new dashboard view. Pages and exports now load faster.",
      action: {
        label: "Dismiss",
        onClick() {
          alert("Dismissed");
        },
      },
    });
  };

  const showWarningToast = () => {
    toast.warning("This project has been unpublished", {
      description: "Removing all users has unpublished this project. Add users to republish.",
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
      description: "Removing all users has unpublished this project. Add users to republish.",
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Toast Notifications Demo</h1>
          <p className="text-gray-600">
            Click any button below to trigger different toast variants
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={showInfoToast}
            className="px-6 py-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg cursor-pointer font-medium hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Toasts will appear in the bottom-right corner and auto-dismiss after 5 seconds
          </p>
        </div>
      </div>
    </div>
  );
};
