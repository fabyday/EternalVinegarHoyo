import React from "react";
import { Layers3, RefreshCw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WineVersion } from "../../../Common/Types/Wine";
import { ImageButton } from "../../Component/ImageButton";
import { InstalledWinePanel } from "../../Component/InstalledWinePanel";
import { LogEntry, LogSession, LogSourceOption, LogViewer } from "../../Component/LogViewer";
import { MacTitleBar } from "../../Component/MacTitleBar";
import { MainFrame, RendererViewKey } from "../../Component/MainFrame";
import { ProgressBar } from "../../Component/ProgressBar";
import { StatusBadge, label_from_status, tone_from_status } from "../../Component/StatusBadge";
import XTermTerminal from "../../Component/Terminal";
import { WindowControls } from "../../Component/WindowControls";
import { SupportedLocale } from "../../I18n";
import { AccentColor } from "../../Theme";
import { PreferenceView } from "../PreferenceView/PreferenceView";
import LogoSquare from "../../../../resouces/bobtongirihoyo.png";
import LogoWide from "../../../../resouces/bobtongirihoyo_wide.png";

export interface InstalledApp {
  id: string;
  name: string;
  subtitle: string;
  wineVersionId: string;
  lastPlayed: string;
  lastPlayedKey?: string;
  status: "ready" | "needs-prefix" | "updating";
}

export interface Bottle {
  id: string;
  name: string;
  description: string;
  wineVersionId: string;
  path: string;
  status: "ready" | "needs-setup" | "updating";
  apps: InstalledApp[];
}

export const INSTALLED_BOTTLES: Bottle[] = [
  {
    id: "hoyoverse",
    name: "HoyoVerse Bottle",
    description: "Shared launcher profile for HoyoVerse titles.",
    wineVersionId: "ge-proton-latest",
    path: "~/Library/Application Support/BDIH/Bottles/hoyoverse",
    status: "ready",
    apps: [
      {
        id: "genshin",
        name: "Genshin Impact",
        subtitle: "HoyoVerse Launcher",
        wineVersionId: "ge-proton-latest",
        lastPlayed: "",
        lastPlayedKey: "main.lastPlayed.today",
        status: "ready",
      },
      {
        id: "starrail",
        name: "Honkai: Star Rail",
        subtitle: "DXMT profile",
        wineVersionId: "ge-proton-latest",
        lastPlayed: "",
        lastPlayedKey: "main.lastPlayed.yesterday",
        status: "ready",
      },
    ],
  },
  {
    id: "steam",
    name: "Steam Bottle",
    description: "Steam and library games using a dedicated prefix.",
    wineVersionId: "wine-9.0-stable",
    path: "~/Library/Application Support/BDIH/Bottles/steam",
    status: "updating",
    apps: [
      {
        id: "steam",
        name: "Steam",
        subtitle: "Wine 9 prefix",
        wineVersionId: "wine-9.0-stable",
        lastPlayed: "",
        lastPlayedKey: "main.lastPlayed.threeDaysAgo",
        status: "updating",
      },
    ],
  },
  {
    id: "custom-tools",
    name: "Custom Tools",
    description: "Manual executables and local test recipes.",
    wineVersionId: "wine-8.0-stable",
    path: "~/Library/Application Support/BDIH/Bottles/custom-tools",
    status: "needs-setup",
    apps: [
      {
        id: "custom",
        name: "Custom Windows App",
        subtitle: "Manual executable",
        wineVersionId: "wine-8.0-stable",
        lastPlayed: "",
        lastPlayedKey: "main.lastPlayed.never",
        status: "needs-prefix",
      },
    ],
  },
];

export interface DashboardViewProps {
  wineVersions: WineVersion[];
  selectedWineVersion?: WineVersion;
  selectedWineVersionId: string;
  installPath: string;
  isLoadingWineVersions: boolean;
  bottles?: Bottle[];
  onSelectWineVersion: (versionId: string) => void;
  onInstallWineVersion: (versionId: string) => void;
}

export interface LauncherViewProps extends DashboardViewProps {
  activeView: RendererViewKey;
  statusText: string;
  onViewChange: (viewKey: RendererViewKey) => void;
  onRefresh: () => void;
  onQuit: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMac?: boolean;
  locale?: SupportedLocale;
  accentColor?: AccentColor;
  logEntries?: LogEntry[];
  logSessions?: LogSession[];
  logSources?: LogSourceOption[];
  onInstallPathChange: (installPath: string) => void;
  onLocaleChange: (locale: SupportedLocale) => void;
  onAccentColorChange: (accentColor: AccentColor) => void;
  onResetInstallPath: () => void;
}

function get_view_title(viewKey: RendererViewKey, translate: (key: string) => string) {
  return translate(`navigation.${viewKey}.label`);
}

function get_view_subtitle(viewKey: RendererViewKey, translate: (key: string) => string) {
  return translate(`navigation.${viewKey}.subtitle`);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0b1020]/70 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function bottle_status_tone(status: Bottle["status"]): "success" | "warning" | "info" {
  if (status === "needs-setup") {
    return "warning";
  }

  if (status === "updating") {
    return "info";
  }

  return "success";
}

function BottleCard({
  bottle,
  isActive,
  onClick,
}: {
  bottle: Bottle;
  isActive: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-40 w-full flex-col rounded-lg border p-4 text-left transition ${
        isActive ? "accent-selection" : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
      }`}
      aria-label={bottle.name}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0b1020] ring-1 ring-white/10">
          <Layers3 size={24} className="text-slate-200" />
        </div>
        <StatusBadge label={t(`main.bottleStatus.${bottle.status}`)} tone={bottle_status_tone(bottle.status)} />
      </div>
      <span className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-100">{bottle.name}</span>
      <span className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{bottle.description}</span>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-slate-400">
        <span>{t("main.bottleApps", { count: bottle.apps.length })}</span>
        <span className="truncate text-slate-500">{bottle.wineVersionId}</span>
      </div>
    </button>
  );
}

export function DashboardView({
  wineVersions,
  selectedWineVersion,
  selectedWineVersionId,
  installPath,
  isLoadingWineVersions,
  bottles = INSTALLED_BOTTLES,
  onSelectWineVersion,
}: DashboardViewProps) {
  const { t } = useTranslation();
  const [isInstalledWineOpen, setIsInstalledWineOpen] = React.useState(false);
  const [selectedBottleId, setSelectedBottleId] = React.useState(() => bottles[0]?.id ?? "");
  const selectedBottle = React.useMemo(
    () => bottles.find((bottle) => bottle.id === selectedBottleId) ?? bottles[0],
    [bottles, selectedBottleId],
  );
  const installedCount = wineVersions.filter((version) => version.status === "installed" || version.status === "completed").length;
  const workingVersion = wineVersions.find((version) => ["downloading", "installing", "extracting"].includes(version.status));
  const appCount = bottles.reduce((total, bottle) => total + bottle.apps.length, 0);

  return (
    <div className="space-y-6 p-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.8fr)]">
        <div className="min-h-60 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
          <div className="grid h-full grid-cols-[minmax(0,1fr)_16rem]">
            <div className="flex min-w-0 flex-col justify-between p-6">
              <div>
                <StatusBadge label={isLoadingWineVersions ? t("common.syncing") : t("common.ready")} tone={isLoadingWineVersions ? "info" : "success"} />
                <h3 className="mt-4 text-2xl font-bold tracking-normal text-white">{t("main.heroTitle")}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{t("main.heroDescription")}</p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Metric label={t("main.metrics.wineCatalog")} value={`${wineVersions.length}`} />
                <Metric label={t("main.metrics.installed")} value={`${installedCount}`} />
                <Metric label={t("main.metrics.bottles")} value={`${bottles.length}`} />
              </div>
            </div>
            <div className="hidden border-l border-white/10 bg-[#101827] p-5 md:block">
              <img src={LogoWide} alt={t("common.appName")} className="h-full w-full rounded-lg object-cover" />
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-white">{t("main.selectedWine")}</h3>
            {selectedWineVersion && (
              <StatusBadge label={label_from_status(selectedWineVersion.status, t)} tone={tone_from_status(selectedWineVersion.status)} />
            )}
          </div>

          {selectedWineVersion ? (
            <div className="space-y-4">
              <div>
                <p className="text-lg font-bold text-white">{selectedWineVersion.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedWineVersion.type} · {selectedWineVersion.version}
                </p>
              </div>
              <ProgressBar
                progressValue={selectedWineVersion.progress}
                descriptionText={workingVersion ? t("main.workProgress") : t("main.installProgress")}
                showValue
                tone={workingVersion ? "blue" : "emerald"}
              />
              <p className="break-all rounded-lg border border-white/10 bg-[#0b1020] p-3 text-xs leading-5 text-slate-400">
                {selectedWineVersion.path ?? installPath}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">{t("main.noWineSelected")}</p>
          )}
        </aside>
      </section>

      <section className={`grid gap-6 ${isInstalledWineOpen ? "xl:grid-cols-[minmax(0,1fr)_28rem]" : ""}`}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white">{t("main.bottleLibrary")}</h3>
              <p className="mt-1 text-xs text-slate-500">{t("main.bottleLibraryDescription", { count: appCount })}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-9 w-64 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-slate-500">
                <Search size={15} />
                <span className="text-xs">{t("main.searchReady")}</span>
              </div>
              <button
                type="button"
                aria-expanded={isInstalledWineOpen}
                onClick={() => setIsInstalledWineOpen((isOpen) => !isOpen)}
                className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${
                  isInstalledWineOpen
                    ? "accent-selection text-white"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <Layers3 size={15} />
                {t("main.installedWine.viewAction")}
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[11px] text-slate-200">{installedCount}</span>
              </button>
            </div>
          </div>

          <div className={`grid gap-4 ${selectedBottle ? "lg:grid-cols-[minmax(0,1fr)_24rem]" : ""}`}>
            <div className="grid content-start gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {bottles.map((bottle) => (
                <BottleCard
                  key={bottle.id}
                  bottle={bottle}
                  isActive={bottle.id === selectedBottle?.id}
                  onClick={() => setSelectedBottleId(bottle.id)}
                />
              ))}
            </div>

            {selectedBottle && (
              <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-white">{selectedBottle.name}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-500">{selectedBottle.description}</p>
                  </div>
                  <StatusBadge label={t(`main.bottleStatus.${selectedBottle.status}`)} tone={bottle_status_tone(selectedBottle.status)} />
                </div>

                <dl className="grid gap-3 text-xs">
                  <div className="rounded-lg border border-white/10 bg-[#0b1020] p-3">
                    <dt className="text-slate-500">{t("main.selectedWine")}</dt>
                    <dd className="mt-1 font-semibold text-slate-200">{selectedBottle.wineVersionId}</dd>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#0b1020] p-3">
                    <dt className="text-slate-500">{t("main.bottlePath")}</dt>
                    <dd className="mt-1 break-all text-slate-300">{selectedBottle.path}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  {t("main.recipeSettings")}
                </button>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-white">{t("main.bottleGames")}</h4>
                    <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-slate-300">{selectedBottle.apps.length}</span>
                  </div>
                  <div className="grid gap-3">
                    {selectedBottle.apps.map((app) => (
                      <ImageButton
                        key={app.id}
                        src={LogoSquare}
                        name={app.name}
                        subtitle={`${app.subtitle} · ${app.lastPlayedKey ? t(app.lastPlayedKey) : app.lastPlayed}`}
                        isActive={app.wineVersionId === selectedWineVersionId}
                        actionLabel={app.status === "needs-prefix" ? t("common.actions.createPrefix") : t("common.actions.run")}
                        className="min-h-32"
                      />
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>

        {isInstalledWineOpen && (
          <InstalledWinePanel
            wineVersions={wineVersions}
            selectedWineVersionId={selectedWineVersionId}
            installPath={installPath}
            className="xl:sticky xl:top-6"
            onSelectWineVersion={onSelectWineVersion}
            onClose={() => setIsInstalledWineOpen(false)}
          />
        )}
      </section>
    </div>
  );
}

export function LauncherView({
  activeView,
  statusText,
  wineVersions,
  selectedWineVersion,
  selectedWineVersionId,
  installPath,
  isLoadingWineVersions,
  bottles,
  onViewChange,
  onRefresh,
  onQuit,
  onMinimize,
  onMaximize,
  isMac = false,
  locale,
  accentColor,
  logEntries = [],
  logSessions = [],
  logSources = [],
  onSelectWineVersion,
  onInstallWineVersion,
  onInstallPathChange,
  onLocaleChange,
  onAccentColorChange,
  onResetInstallPath,
}: LauncherViewProps) {
  const { t } = useTranslation();

  return (
    <MainFrame
      title={get_view_title(activeView, t)}
      subtitle={get_view_subtitle(activeView, t)}
      logoSrc={LogoSquare}
      activeView={activeView}
      statusText={statusText}
      titleBar={
        isMac ? (
          <MacTitleBar title={t("common.appName")} onQuit={onQuit} onMinimize={onMinimize} onMaximize={onMaximize} />
        ) : undefined
      }
      actions={
        isMac ? (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            title={t("common.actions.refresh")}
            aria-label={t("common.actions.refresh")}
          >
            <RefreshCw size={16} />
            <span className="hidden lg:inline">{t("common.actions.refresh")}</span>
          </button>
        ) : (
          <WindowControls onRefresh={onRefresh} onMinimize={onMinimize} onMaximize={onMaximize} onQuit={onQuit} />
        )
      }
      onViewChange={onViewChange}
    >
      {activeView === "dashboard" && (
        <DashboardView
          wineVersions={wineVersions}
          selectedWineVersion={selectedWineVersion}
          selectedWineVersionId={selectedWineVersionId}
          installPath={installPath}
          isLoadingWineVersions={isLoadingWineVersions}
          bottles={bottles}
          onSelectWineVersion={onSelectWineVersion}
          onInstallWineVersion={onInstallWineVersion}
        />
      )}
      {activeView === "terminal" && (
        <div className="h-full p-6">
          <XTermTerminal height="100%" welcomeMessage={t("main.terminalWelcome")} />
        </div>
      )}
      {activeView === "logs" && (
        <div className="h-full p-6">
          <LogViewer entries={logEntries} sessions={logSessions} sources={logSources} className="h-full" />
        </div>
      )}
      {activeView === "preferences" && (
        <PreferenceView
          installPath={installPath}
          locale={locale}
          accentColor={accentColor}
          onInstallPathChange={onInstallPathChange}
          onLocaleChange={onLocaleChange}
          onAccentColorChange={onAccentColorChange}
          onReset={onResetInstallPath}
        />
      )}
    </MainFrame>
  );
}


