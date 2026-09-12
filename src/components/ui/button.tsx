import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none outline-none disabled:pointer-events-none disabled:opacity-40 transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:not-disabled:scale-[0.96] focus-visible:ring-2 focus-visible:ring-ring/60",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-border)] hover:bg-[#f6f2ea]",
        secondary:
          "bg-card-2 text-foreground shadow-[var(--shadow-border)] hover:bg-[#252521]",
        ghost: "bg-transparent text-foreground hover:bg-card-2",
        outline:
          "bg-transparent text-foreground shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
        danger: "bg-owe/15 text-owe hover:bg-owe/25",
      },
      size: {
        default: "h-12 rounded-xl px-5 text-sm",
        sm: "h-10 rounded-lg px-3.5 text-sm",
        lg: "h-14 rounded-2xl px-6 text-base",
        icon: "size-11 rounded-xl",
        pill: "h-10 rounded-full px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
