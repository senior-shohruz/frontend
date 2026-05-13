import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-xs font-medium text-ink-700 mb-1.5", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "w-full h-9 px-3 text-sm bg-white text-ink-900",
          "border border-ink-200 rounded-md",
          "placeholder:text-ink-400",
          "focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20",
          "transition-all duration-150",
          "disabled:bg-ink-50 disabled:text-ink-400",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(
          "w-full px-3 py-2 text-sm bg-white text-ink-900",
          "border border-ink-200 rounded-md resize-y min-h-[80px]",
          "placeholder:text-ink-400",
          "focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20",
          "transition-all duration-150",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <div className="w-full">
      <select
        ref={ref}
        className={cn(
          "w-full h-9 px-3 text-sm bg-white text-ink-900",
          "border border-ink-200 rounded-md",
          "focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20",
          "transition-all duration-150",
          error && "border-danger",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";
