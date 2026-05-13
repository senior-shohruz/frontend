"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ open, onClose, title, description, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          "relative bg-white border border-ink-200 rounded-xl shadow-popover w-full animate-scale-in",
          "max-h-[90vh] flex flex-col",
          sizes[size]
        )}
      >
        {(title || description) && (
          <div className="px-6 pt-5 pb-4 border-b border-ink-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && (
                  <h2 className="font-display text-2xl text-ink-900 leading-tight">{title}</h2>
                )}
                {description && (
                  <p className="text-sm text-ink-500 mt-1">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-ink-400 hover:text-ink-700 transition-colors p-1 -m-1 rounded"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
