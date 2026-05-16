import { readUserSettings, writeUserSettings } from "../FileIO/IO";
import { LauncherPreferencePayload } from "../../Common/Types/IPC";

export type LauncherPreference = LauncherPreferencePayload;

export const DEFAULT_LAUNCHER_PREFERENCE: LauncherPreference = {
  language: "ko",
  wineInstallPath: "",
  gameInstallPath: "",
  autoCheckUpdates: true,
  closeToTray: false,
};

export class PreferenceManager {
  private cache: LauncherPreference | null = null;

  async getPreference(forceReload = false): Promise<LauncherPreference> {
    if (this.cache && !forceReload) {
      return this.cache;
    }

    this.cache = await this.loadPreference();
    return this.cache;
  }

  async savePreference(preference: LauncherPreference): Promise<void> {
    const normalized = this.normalizePreference(preference);
    await writeUserSettings(JSON.stringify(normalized, null, 2));
    this.cache = normalized;
  }

  async updatePreference(
    patch: Partial<LauncherPreference>,
  ): Promise<LauncherPreference> {
    const current = await this.getPreference();
    const next = this.normalizePreference({ ...current, ...patch });
    await this.savePreference(next);
    return next;
  }

  private async loadPreference(): Promise<LauncherPreference> {
    try {
      const data = await readUserSettings();
      return this.normalizePreference(JSON.parse(data));
    } catch (error) {
      if (this.isMissingFileError(error)) {
        return DEFAULT_LAUNCHER_PREFERENCE;
      }

      throw error;
    }
  }

  private normalizePreference(value: unknown): LauncherPreference {
    const record = this.isRecord(value) ? value : {};

    return {
      language: this.stringOrDefault(record.language, "ko"),
      wineInstallPath: this.stringOrDefault(record.wineInstallPath, ""),
      gameInstallPath: this.stringOrDefault(record.gameInstallPath, ""),
      autoCheckUpdates: this.booleanOrDefault(record.autoCheckUpdates, true),
      closeToTray: this.booleanOrDefault(record.closeToTray, false),
    };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  private stringOrDefault(value: unknown, fallback: string): string {
    return typeof value === "string" ? value : fallback;
  }

  private booleanOrDefault(value: unknown, fallback: boolean): boolean {
    return typeof value === "boolean" ? value : fallback;
  }

  private isMissingFileError(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    );
  }
}

export const preferenceManager = new PreferenceManager();
