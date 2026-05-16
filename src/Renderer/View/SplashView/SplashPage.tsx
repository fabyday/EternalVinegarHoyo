import React from "react";
import { useTranslation } from "react-i18next";
import LogoWide from "../../../../resouces/bobtongirihoyo_wide.png";

export interface SplashViewProps {
  progress?: number;
  message?: string;
  logoSrc?: string;
}

export function SplashView({ progress = 48, message, logoSrc = LogoWide }: SplashViewProps) {
  const { t } = useTranslation();
  const safeProgress = Math.min(Math.max(Number(progress), 0), 100);
  const title = t("common.appName");

  return (
    <div className="flex h-dvh min-h-[600px] w-full items-center justify-center bg-[#0b1020] p-6 text-white">
      <section className="w-full max-w-3xl">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#080d19] shadow-2xl shadow-black/40">
          <img src={logoSrc} alt={title} className="aspect-[16/9] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050812] via-[#050812]/86 to-transparent px-6 pb-6 pt-28">
            <div className="max-w-xl space-y-4">
              <div>
                <h1 className="relative inline-block text-4xl font-black tracking-normal text-white/18 md:text-5xl">
                  <span aria-hidden="true">{title}</span>
                  <span
                    aria-label={title}
                    className="absolute inset-0 overflow-hidden bg-gradient-to-t from-sky-200 via-cyan-300 to-white bg-clip-text text-transparent transition-[clip-path] duration-500"
                    style={{ clipPath: `inset(${100 - safeProgress}% 0 0 0)` }}
                  >
                    {title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 h-3 rounded-full bg-cyan-200/35 blur-sm transition-[bottom] duration-500"
                    style={{ bottom: `${safeProgress}%`, transform: "translateY(50%)" }}
                  />
                </h1>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">{t("splash.description")}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
                  <span className="min-w-0 truncate">{message ?? t("splash.defaultMessage")}</span>
                  <span className="shrink-0 font-mono">{Math.round(safeProgress)}%</span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-white/12"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={safeProgress}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-rose-300 shadow-[0_0_18px_rgba(125,211,252,0.55)] transition-[width] duration-500"
                    style={{ width: `${safeProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
