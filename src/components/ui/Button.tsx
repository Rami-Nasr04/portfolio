import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The one button style of the site: outlined, mono, lifts up-left on hover and focus.
 * The invisible ::after reaches past the border so the pointer stays "on" the button as it
 * lifts; without it the hover flickers at the edges.
 */
export const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-control border border-accent bg-transparent font-mono whitespace-nowrap text-accent transition-[background-color,box-shadow,transform,opacity] duration-200 ease-glide hover:bg-accent/10 focus-visible:bg-accent/10 after:absolute after:-inset-2 after:content-[''] active:translate-0 active:shadow-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "px-3.5 py-2 text-xs hover:-translate-0.5 hover:shadow-lift-sm focus-visible:-translate-0.5 focus-visible:shadow-lift-sm",
        md: "px-6 py-3.5 text-sm hover:-translate-1 hover:shadow-lift focus-visible:-translate-1 focus-visible:shadow-lift",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** Icon-only controls (theme, menu, close) stay quiet: no border, accent on hover. */
export const ICON_CONTROL =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-control text-muted-foreground transition-colors duration-200 hover:text-accent [&_svg]:size-5";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ size }), className)} {...props} />;
}
