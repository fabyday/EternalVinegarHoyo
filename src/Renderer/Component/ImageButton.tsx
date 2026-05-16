import React from "react";
import { useTranslation } from "react-i18next";
import { Monitor, Play } from "lucide-react";

export interface ImageButtonProps {
  id?: string;
  src?: string;
  name?: string;
  subtitle?: string;
  actionLabel?: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onMouseHover?: () => void;
}

export function ImageButton({
  src,
  name = "Untitled",
  subtitle,
  actionLabel,
  isActive = false,
  className = "",
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseHover,
}: ImageButtonProps) {
  const { t } = useTranslation();
  const resolvedActionLabel = actionLabel ?? t("common.actions.run");

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseHover}
      className={`group flex min-h-36 w-full flex-col rounded-lg border p-3 text-left transition ${
        isActive ? "accent-selection" : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
      } ${className}`}
      aria-label={`${name} ${resolvedActionLabel}`}
    >
      <div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-slate-800 ring-1 ring-white/10">
        {src ? (
          <img className="h-full w-full object-cover" src={src} alt="" draggable={false} />
        ) : (
          <Monitor className="text-slate-300" size={30} />
        )}
      </div>
      <span className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-100">{name}</span>
      {subtitle && <span className="mt-1 truncate text-xs text-slate-500">{subtitle}</span>}
      <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-medium text-emerald-300 opacity-0 transition group-hover:opacity-100">
        <Play size={13} fill="currentColor" />
        {resolvedActionLabel}
      </span>
    </button>
  );
}
