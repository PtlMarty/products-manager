"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/organisms/dialog";
import { Plus } from "lucide-react";
import React, { useState } from "react";

interface BaseFormDialogProps {
  title?: string;
  trigger?: React.ReactNode;
  className?: string;
  standalone?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onSubmit: () => Promise<void>;
  onCancel?: () => void;
  submitLabel?: {
    default: string;
    loading: string;
  };
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function BaseFormDialog({
  title,
  trigger,
  className,
  standalone = true,
  isLoading = false,
  error,
  onSubmit,
  onCancel,
  submitLabel = {
    default: "Submit",
    loading: "Submitting...",
  },
  children,
  defaultOpen = false,
}: BaseFormDialogProps) {
  const [open, setOpen] = useState(defaultOpen);

  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
  };

  const formContent = (
    <>
      {title && (
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit();
          if (standalone) {
            setOpen(false);
          }
        }}
        className="mt-4 space-y-4"
      >
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {children}

        <div className="flex justify-end gap-3 mt-6">
          {standalone && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? submitLabel.loading : submitLabel.default}
          </button>
        </div>
      </form>
    </>
  );

  if (!standalone) {
    return formContent;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className={`inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${className}`}
          >
            <Plus className="h-5 w-5" />
            <span>{title}</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">{formContent}</DialogContent>
    </Dialog>
  );
}

// Common form field wrapper component
interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// Common input styles
export const inputStyles =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

// Common select styles
export const selectStyles =
  "w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer appearance-none";
