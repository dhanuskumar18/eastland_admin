"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  return (
      <>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const iconByVariant = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-200" />,
          warning: <TriangleAlert className="h-5 w-5 text-amber-200" />,
          info: <Info className="h-5 w-5 text-sky-200" />,
          destructive: <TriangleAlert className="h-5 w-5 text-red-200" />,
          default: null,
        } as const;
        return (
          <Toast key={id} variant={variant as any} {...props}>
            <div className="flex w-full items-start gap-3 pr-6">
              <div className={cn(
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                variant === "success" && "border-emerald-300/40 bg-emerald-500/20",
                variant === "warning" && "border-amber-300/40 bg-amber-500/20",
                variant === "info" && "border-sky-300/40 bg-sky-500/20",
                variant === "destructive" && "border-red-300/40 bg-red-500/20",
              )}>
                {iconByVariant[(variant as keyof typeof iconByVariant) ?? "default"]}
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
                {/* Progress bar */}
                {props.duration && props.duration > 0 ? (
                  <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full w-full origin-left animate-toast-progress bg-foreground/40 group-[.success]:bg-emerald-200/80 group-[.warning]:bg-amber-200/80 group-[.info]:bg-sky-200/80 group-[.destructive]:bg-red-200/80"
                      style={{ animationDuration: `${props.duration}ms` }}
                    />
                  </div>
                ) : null}
              </div>
              {action}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
      </>
  );
}
