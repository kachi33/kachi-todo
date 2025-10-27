import * as React from "react";

export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * VisuallyHidden component
 *
 * Hides content visually while keeping it accessible to screen readers.
 * Useful for adding accessible labels and descriptions that don't need
 * to be visible to sighted users.
 */
export function VisuallyHidden({
  children,
  className,
  ...props
}: VisuallyHiddenProps) {
  return (
    <span
      className={`absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 ${className || ''}`}
      style={{
        clip: "rect(0, 0, 0, 0)",
        clipPath: "inset(50%)",
      }}
      {...props}
    >
      {children}
    </span>
  );
}
