import React from "react";
import { Layers3, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WineVersion } from "../../Common/Types/Wine";
import { StatusBadge } from "./StatusBadge";
import { WineVersionCard } from "./WineVersionCard";

export interface InstalledWinePanelProps {
  wineVersions: WineVersion[];
  selectedWineVersionId?: string;
  installPath?: string;
  className?: string;
  onSelectWineVersion?: (versionId: string) => void;
  onClose?: () => void;
}

const VISIBLE_WINE_STATUSES = new Set(["installed", "completed", "downloading", "installing", "extracting"]);

export function get_visible_installed_wine_versions(wineVersions: WineVersion[]) {
  return wineVersions.filter((version) => VISIBLE_WINE_STATUSES.has(version.status));
}

export function InstalledWinePanel({
  wineVersions,
  selectedWineVersionId,
  installPath,
  className = "",
  onSelectWineVersion,
  onClose,
}: InstalledWinePanelProps) {
  const { t } = useTranslation();
  const visibleWineVersions = get_visible_installed_wine_versions(wineVersions);

  return (
    <aside className={`rounded-lg border border-white/10 bg-[#101827] p-5 shadow-2xl shadow-black/20 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="accent-subtle accent-text flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 accent-ring">
            <Layers3 size={20} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-white">{t("main.installedWine.title")}</h3>
              <StatusBadge label={`${visibleWineVersions.length}`} tone="neutral" />
            </div>
            <p className="mt-1 text-sm leading-5 text-slate-500">{t("main.installedWine.description")}</p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            aria-label={t("common.actions.close")}
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {visibleWineVersions.length > 0 ? (
        <div className="mt-5 space-y-3">
          {visibleWineVersions.map((version) => (
            <WineVersionCard
              key={version.id}
              version={version}
              installPath={installPath}
              isSelected={version.id === selectedWineVersionId}
              showInstallAction={false}
              onSelect={onSelectWineVersion}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-500">
          {t("main.installedWine.empty")}
        </div>
      )}
    </aside>
  );
}
