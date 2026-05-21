import type { ButtonHTMLAttributes, ReactNode } from "react";

type AgentPayButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<AgentPayButtonVariant, string> = {
  primary:
    "border-cyan-300/40 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 active:from-cyan-500 active:to-blue-600",
  secondary:
    "border-white/20 bg-white/10 text-zinc-100 hover:bg-white/15 active:bg-white/20",
  ghost: "border-transparent bg-transparent text-zinc-300 hover:bg-white/10 hover:text-white active:bg-white/15",
  danger: "border-red-400/40 bg-red-500/20 text-red-100 hover:bg-red-500/30 active:bg-red-500/40",
};

export function AgentPayButton({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: AgentPayButtonVariant;
}) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition duration-150 focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070A12] disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className ?? ""}`.trim()}
    >
      {children}
    </button>
  );
}
