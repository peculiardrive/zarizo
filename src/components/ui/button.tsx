import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    let classes = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    // variant classes
    if (variant === "default") classes += " bg-blue-600 text-white hover:bg-blue-700";
    if (variant === "outline") classes += " border border-input bg-background hover:bg-accent hover:text-accent-foreground";
    if (variant === "ghost") classes += " hover:bg-accent hover:text-accent-foreground";
    if (variant === "link") classes += " text-primary underline-offset-4 hover:underline";
    
    // size classes
    if (size === "default") classes += " h-10 px-4 py-2";
    if (size === "sm") classes += " h-9 rounded-md px-3";
    if (size === "lg") classes += " h-11 rounded-md px-8";
    if (size === "icon") classes += " h-10 w-10";

    if (className) classes += " " + className;

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
