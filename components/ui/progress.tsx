import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  variant?: "default" | "accent" | "success";
  size?: "sm" | "md";
}

export function Progress({ value, className, variant = "default", size = "md" }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  const variants = {
    default: "bg-ink-700",
    accent:  "bg-accent-500",
    success: "bg-success",
  };

  return (
    <div
      className={cn(
        "w-full bg-ink-100 rounded-full overflow-hidden",
        size === "sm" ? "h-1" : "h-1.5",
        className
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out",
          variants[variant]
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
