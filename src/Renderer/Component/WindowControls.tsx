import React from "react";
import { Maximize2, Minus, Power, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface WindowControlsProps {
  onRefresh?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onQuit: () => void;
  className?: string;
}

export function WindowControls({ onRefresh, onMinimize, onMaximize, onQuit, className = "" }: WindowControlsProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`inline-flex h-11 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] p-1 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md [-webkit-app-region:no-drag] ${className}`}
      aria-label={t("windowControls.label")}
    >
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/40"
          title={t("common.actions.refresh")}
          aria-label={t("common.actions.refresh")}
        >
          <RefreshCw size={16} />
          <span className="hidden lg:inline">{t("common.actions.refresh")}</span>
        </button>
      )}
      {onRefresh && <span className="mx-1 h-5 w-px bg-white/10" aria-hidden="true" />}
      {onMinimize && (
        <button
          type="button"
          onClick={onMinimize}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/40"
          title={t("titleBar.minimize")}
          aria-label={t("titleBar.minimize")}
        >
          <Minus size={16} />
        </button>
      )}
      {onMaximize && (
        <button
          type="button"
          onClick={onMaximize}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/40"
          title={t("titleBar.maximize")}
          aria-label={t("titleBar.maximize")}
        >
          <Maximize2 size={16} />
        </button>
      )}
      <button
        type="button"
        onClick={onQuit}
        className="group relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-300/20 bg-rose-500/15 text-rose-200 transition hover:border-rose-300/40 hover:bg-rose-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-300/50"
        title={t("common.actions.quit")}
        aria-label={t("common.actions.quit")}
      >
        <span className="absolute inset-0 rounded-md bg-rose-400/0 transition group-hover:bg-rose-300/10" aria-hidden="true" />
        <Power size={16} />
      </button>
    </div>
  );
}
