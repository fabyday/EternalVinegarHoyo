import { create } from "zustand";
import { PREDEFINED_WINE_VERSIONS } from "../../Common/Constant/WineCatalog";
import { IPC_CHANNELS, WineStatusPayload } from "../../Common/Types/IPC";
import { WineVersion } from "../../Common/Types/Wine";
import i18n from "../I18n/I18n";

export interface SystemSummary {
  platform: string;
  arch: string;
  rendererMode: "electron" | "storybook" | "browser";
}

export interface SystemStoreState {
  wineVersions: WineVersion[];
  selectedWineVersionId: string;
  installPath: string;
  isLoadingWineVersions: boolean;
  lastStatusMessage: string;
  systemSummary: SystemSummary;
  loadWineVersions: () => Promise<void>;
  installWineVersion: (versionId: string) => Promise<void>;
  selectWineVersion: (versionId: string) => void;
  setInstallPath: (installPath: string) => void;
  subscribeWineStatus: () => () => void;
}

const DEFAULT_INSTALL_PATH = "~/Library/Application Support/BDIH/Wine";

function get_bith_api() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.BTIH_API;
}

function create_system_summary(): SystemSummary {
  if (typeof navigator === "undefined") {
    return {
      platform: "unknown",
      arch: "unknown",
      rendererMode: "storybook",
    };
  }

  return {
    platform: navigator.platform || "unknown",
    arch: navigator.userAgent.includes("arm64") || navigator.userAgent.includes("aarch64") ? "arm64" : "x64",
    rendererMode: get_bith_api() ? "electron" : "browser",
  };
}

function normalize_wine_versions(versions: unknown): WineVersion[] {
  if (!Array.isArray(versions) || versions.length === 0) {
    return PREDEFINED_WINE_VERSIONS;
  }

  return versions as WineVersion[];
}

function update_wine_status(versions: WineVersion[], payload: WineStatusPayload): WineVersion[] {
  return versions.map((version) => {
    if (version.id !== payload.versionId) {
      return version;
    }

    return {
      ...version,
      status: payload.status,
      progress: payload.progress,
    };
  });
}

export const useSystemStore = create<SystemStoreState>((set, get) => ({
  wineVersions: PREDEFINED_WINE_VERSIONS,
  selectedWineVersionId: PREDEFINED_WINE_VERSIONS[0]?.id ?? "",
  installPath: DEFAULT_INSTALL_PATH,
  isLoadingWineVersions: false,
  lastStatusMessage: i18n.t("store.catalogLocal"),
  systemSummary: create_system_summary(),

  loadWineVersions: async () => {
    set({ isLoadingWineVersions: true });

    try {
      const api = get_bith_api();
      const versions = api
        ? await api.invoke(IPC_CHANNELS.WINE.GET_VERSION_LIST.channelName, undefined as never)
        : PREDEFINED_WINE_VERSIONS;
      const wineVersions = normalize_wine_versions(versions);

      set({
        wineVersions,
        selectedWineVersionId: wineVersions[0]?.id ?? "",
        isLoadingWineVersions: false,
        lastStatusMessage: api ? i18n.t("store.catalogMain") : i18n.t("store.catalogLocal"),
      });
    } catch (error) {
      set({
        wineVersions: PREDEFINED_WINE_VERSIONS,
        selectedWineVersionId: PREDEFINED_WINE_VERSIONS[0]?.id ?? "",
        isLoadingWineVersions: false,
        lastStatusMessage: error instanceof Error ? error.message : i18n.t("store.catalogFailed"),
      });
    }
  },

  installWineVersion: async (versionId: string) => {
    const { installPath } = get();

    set((state) => ({
      wineVersions: state.wineVersions.map((version) =>
        version.id === versionId ? { ...version, status: "installing", progress: Math.max(version.progress, 5) } : version,
      ),
      lastStatusMessage: i18n.t("store.installRequested", { versionId }),
    }));

    try {
      const api = get_bith_api();

      if (api) {
        await api.invoke(IPC_CHANNELS.WINE.INSTALL.channelName, {
          versionId,
          installPath,
        });
      } else {
        set((state) => ({
          wineVersions: state.wineVersions.map((version) =>
            version.id === versionId ? { ...version, status: "installed", progress: 100, path: installPath } : version,
          ),
          lastStatusMessage: i18n.t("store.previewInstallComplete"),
        }));
      }
    } catch (error) {
      set((state) => ({
        wineVersions: state.wineVersions.map((version) =>
          version.id === versionId ? { ...version, status: "error", progress: version.progress } : version,
        ),
        lastStatusMessage: error instanceof Error ? error.message : i18n.t("store.installFailed"),
      }));
    }
  },

  selectWineVersion: (versionId: string) => {
    set({ selectedWineVersionId: versionId });
  },

  setInstallPath: (installPath: string) => {
    set({ installPath });
  },

  subscribeWineStatus: () => {
    const api = get_bith_api();

    if (!api) {
      return () => undefined;
    }

    return api.on(IPC_CHANNELS.WINE.STATUS_UPDATE.channelName, (_event, payload) => {
      set((state) => ({
        wineVersions: update_wine_status(state.wineVersions, payload),
        lastStatusMessage: payload.message ?? `${payload.versionId}: ${payload.status}`,
      }));
    });
  },
}));
