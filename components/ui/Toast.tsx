"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      // Position: top-right on all viewports
      "fixed right-4 top-4 z-[100] flex max-h-screen w-auto flex-col gap-3 p-0 left-auto bottom-auto md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));

ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  [
    "group pointer-events-auto relative flex w-full items-center justify-between overflow-hidden",
    // Card styles
    "rounded-xl border backdrop-blur shadow-xl",
    // Layout and spacing
    "p-4 pr-10",
    // Motion
    "transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out",
    "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "group border-border text-foreground bg-background/80 supports-[backdrop-filter]:bg-background/60",
        destructive:
          "destructive group border-destructive/30 bg-destructive text-destructive-foreground",
        success:
          "success group border-emerald-500/30 text-emerald-50 bg-emerald-600/90 dark:bg-emerald-600/80",
        warning:
          "warning group border-amber-500/30 text-amber-50 bg-amber-600/90 dark:bg-amber-600/80",
        info:
          "info group border-sky-500/30 text-sky-50 bg-sky-600/90 dark:bg-sky-600/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});

Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Variant-aware styles
      "group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      "group-[.success]:border-emerald-200/40 group-[.success]:hover:bg-emerald-500/20 group-[.success]:focus:ring-emerald-400",
      "group-[.warning]:border-amber-200/40 group-[.warning]:hover:bg-amber-500/20 group-[.warning]:focus:ring-amber-400",
      "group-[.info]:border-sky-200/40 group-[.info]:hover:bg-sky-500/20 group-[.info]:focus:ring-sky-400",
      className,
    )}
    {...props}
  />
));

ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2.5 top-2.5 rounded-md p-1.5 text-foreground/60 opacity-0 transition-all hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      // Variant-aware close button
      "group-[.destructive]:text-red-50/80 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-300",
      "group-[.success]:text-emerald-50/80 group-[.success]:hover:text-emerald-50 group-[.success]:focus:ring-emerald-300",
      "group-[.warning]:text-amber-50/80 group-[.warning]:hover:text-amber-50 group-[.warning]:focus:ring-amber-300",
      "group-[.info]:text-sky-50/80 group-[.info]:hover:text-sky-50 group-[.info]:focus:ring-sky-300",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));

ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "text-sm font-semibold tracking-tight",
      "group-[.destructive]:text-destructive-foreground",
      "group-[.success]:text-emerald-50",
      "group-[.warning]:text-amber-50",
      "group-[.info]:text-sky-50",
      className,
    )}
    {...props}
  />
));

ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-xs sm:text-sm opacity-90",
      "group-[.destructive]:text-destructive-foreground/90",
      "group-[.success]:text-emerald-50/90",
      "group-[.warning]:text-amber-50/90",
      "group-[.info]:text-sky-50/90",
      className,
    )}
    {...props}
  />
));

ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
