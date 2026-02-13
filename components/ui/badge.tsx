import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[rgba(0,255,163,0.12)] text-[#00FFA3]",
        secondary: "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.7)]",
        destructive: "border-transparent bg-[rgba(239,68,68,0.12)] text-[#F87171]",
        outline: "border-[rgba(255,255,255,0.1)] text-foreground",
        success: "border-transparent bg-[rgba(0,255,163,0.12)] text-[#00FFA3]",
        warning: "border-transparent bg-[rgba(245,158,11,0.12)] text-[#FBBF24]",
        live: "border-transparent bg-[rgba(0,255,163,0.15)] text-[#00FFA3] font-semibold",
        matching: "border-transparent bg-[rgba(59,130,246,0.12)] text-[#60A5FA]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
