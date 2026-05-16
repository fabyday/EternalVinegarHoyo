import React from "react";
import { AlertTriangle, CheckCircle2, Info, LucideIcon, X } from "lucide-react";

export type DialogTone = "neutral" | "info" | "success" | "warning" | "danger";
export type DialogActionVariant = "primary" | "secondary" | "danger";
export type DialogPlacement = "top" | "center";

export interface DialogAction {
  label: string;
  icon?: LucideIcon;
  variant?: DialogActionVariant;
  disabled?: boolean;
  autoFocus?: boolean;
  onClick: () => void;
}

export interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  tone?: DialogTone;
  icon?: LucideIcon;
  children?: React.ReactNode;
  actions?: DialogAction[];
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  placement?: DialogPlacement;
  widthClassName?: string;
  className?: string;
}

export interface DialogHostProps {
  children: React.ReactNode;
  dialog?: React.ReactNode;
}

const TONE_CLASS_MAP: Record<DialogTone, { icon: string; iconBox: string; border: string; defaultIcon: LucideIcon }> = {
  neutral: {
    icon: "text-slate-200",
    iconBox: "border-white/10 bg-white/[0.05]",
    border: "border-white/10",
    defaultIcon: Info,
  },
  info: {
    icon: "text-sky-200",
    iconBox: "border-sky-400/25 bg-sky-400/10",
    border: "border-sky-400/25",
    defaultIcon: Info,
  },
  success: {
    icon: "text-emerald-200",
    iconBox: "border-emerald-400/25 bg-emerald-400/10",
    border: "border-emerald-400/25",
    defaultIcon: CheckCircle2,
  },
  warning: {
    icon: "text-amber-200",
    iconBox: "border-amber-400/25 bg-amber-400/10",
    border: "border-amber-400/25",
    defaultIcon: AlertTriangle,
  },
  danger: {
    icon: "text-red-200",
    iconBox: "border-red-400/25 bg-red-400/10",
    border: "border-red-400/25",
    defaultIcon: AlertTriangle,
  },
};

const ACTION_CLASS_MAP: Record<DialogActionVariant, string> = {
  primary: "accent-primary",
  secondary: "border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.07]",
  danger: "border border-red-400/25 bg-red-500/15 text-red-100 hover:bg-red-500/25",
};

export function DialogHost({ children, dialog }: DialogHostProps) {
  return (
    <>
      {children}
      {dialog}
    </>
  );
}

export function Dialog({
  open,
  title,
  description,
  tone = "neutral",
  icon,
  children,
  actions = [],
  onClose,
  closeOnBackdrop = true,
  showCloseButton = true,
  placement = "top",
  widthClassName = "max-w-lg",
  className = "",
}: DialogProps) {
  React.useEffect(() => {
    if (!open || !onClose) {
      return undefined;
    }

    const handle_key_down = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handle_key_down);
    return () => window.removeEventListener("keydown", handle_key_down);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const toneClasses = TONE_CLASS_MAP[tone];
  const Icon = icon ?? toneClasses.defaultIcon;
  const placementClass = placement === "center" ? "items-center pb-16" : "items-start pt-24";

  function handle_backdrop_click(event: React.MouseEvent<HTMLDivElement>) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose?.();
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex justify-center bg-black/45 px-4 backdrop-blur-sm ${placementClass}`}
      role="presentation"
      onMouseDown={handle_backdrop_click}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-description" : undefined}
        className={`w-full ${widthClassName} rounded-lg border ${toneClasses.border} bg-[#0f172a] p-5 text-slate-100 shadow-2xl shadow-black/45 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md border ${toneClasses.iconBox}`}>
            <Icon size={20} className={toneClasses.icon} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 id="dialog-title" className="text-base font-semibold text-white">
              {title}
            </h2>
            {description ? (
              <p id="dialog-description" className="mt-1 text-sm leading-5 text-slate-400">
                {description}
              </p>
            ) : null}
          </div>

          {showCloseButton ? (
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Close dialog"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        {children ? <div className="mt-4 text-sm leading-6 text-slate-300">{children}</div> : null}

        {actions.length > 0 ? (
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {actions.map((action) => {
              const ActionIcon = action.icon;
              const variant = action.variant ?? "secondary";

              return (
                <button
                  key={action.label}
                  type="button"
                  autoFocus={action.autoFocus}
                  disabled={action.disabled}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${ACTION_CLASS_MAP[variant]}`}
                  onClick={action.onClick}
                >
                  {ActionIcon ? <ActionIcon size={16} /> : null}
                  {action.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}
