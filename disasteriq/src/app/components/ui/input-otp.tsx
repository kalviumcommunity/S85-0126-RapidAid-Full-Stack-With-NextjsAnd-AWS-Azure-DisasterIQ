"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import { cn } from "@/app/lib/utils";

/* -------------------------------- InputOTP -------------------------------- */

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

/* ------------------------------ InputOTPGroup ------------------------------ */

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

/* ------------------------------ InputOTPSlot ------------------------------- */

interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const context = React.useContext(OTPInputContext);

    // ✅ SAFETY: prevent crashes if used incorrectly
    if (!context || !context.slots[index]) {
      return null;
    }

    const { char, hasFakeCaret, isActive } = context.slots[index];

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all",
          "first:rounded-l-md first:border-l last:rounded-r-md",
          isActive && "z-10 ring-2 ring-ring ring-offset-background",
          className
        )}
        {...props}
      >
        {char}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-caret-blink h-4 w-px bg-foreground" />
          </div>
        )}
      </div>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot";

/* ---------------------------- InputOTPSeparator ---------------------------- */

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot className="h-4 w-4 text-muted-foreground" />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

/* --------------------------------- Export --------------------------------- */

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
};
