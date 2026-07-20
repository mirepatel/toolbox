"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive ref={ref} className={cn("flex w-full flex-col", className)} {...props} />
));
Command.displayName = "Command";

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function CommandDialog({ open, onOpenChange, children }: CommandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogTitle className="sr-only">Search tools</DialogTitle>
        <DialogDescription className="sr-only">
          Search and jump to any tool by name, description, or category.
        </DialogDescription>
        <Command shouldFilter={false} className="[&_[cmdk-group-heading]]:px-2">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function CommandInput({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
      <Search size={16} className="text-muted-foreground shrink-0" />
      <CommandPrimitive.Input
        className={cn(
          "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
          className
        )}
        {...props}
      />
    </div>
  );
}

export const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-80 overflow-y-auto overflow-x-hidden py-2", className)}
    {...props}
  />
));
CommandList.displayName = "CommandList";

export function CommandEmpty(props: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty className="py-8 text-center text-sm text-muted-foreground" {...props} />
  );
}

export function CommandGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "px-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm outline-none aria-selected:bg-accent/10",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";
