import * as React from "react";
import { Drawer as Vaul } from "vaul";
import { cn } from "@/lib/utils";

export function Drawer(props: React.ComponentProps<typeof Vaul.Root>) {
  return <Vaul.Root shouldScaleBackground={false} {...props} />;
}

export const DrawerTrigger = Vaul.Trigger;
export const DrawerClose = Vaul.Close;
export const DrawerPortal = Vaul.Portal;

export function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Vaul.Overlay>) {
  return (
    <Vaul.Overlay
      className={cn("fixed inset-0 z-[80] bg-overlay", className)}
      {...props}
    />
  );
}

export function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Vaul.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <Vaul.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-[90] flex max-h-[92dvh] flex-col rounded-t-2xl bg-card outline-none",
          "shadow-[0_-8px_40px_rgb(0_0_0/0.4)]",
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-foreground/15" />
        {children}
      </Vaul.Content>
    </DrawerPortal>
  );
}

export function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof Vaul.Title>) {
  return (
    <Vaul.Title
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof Vaul.Description>) {
  return (
    <Vaul.Description className={cn("text-sm text-muted", className)} {...props} />
  );
}
