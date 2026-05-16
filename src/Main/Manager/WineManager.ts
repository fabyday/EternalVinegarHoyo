import { WebContents } from "electron";
import { PREDEFINED_WINE_VERSIONS } from "../../Common/Constant/WineCatalog";
import {
  IPC_CHANNELS,
  InstallRequest,
  WineStatusPayload,
} from "../../Common/Types/IPC";
import { WineVersion } from "../../Common/Types/Wine";
import { logManager } from "./LogManager";

export class WineManager {
  private readonly logger = logManager.createLogger({ file: "wine", source: "wine" });

  getVersionList(): WineVersion[] {
    this.logger.debug("loaded wine version list", { count: PREDEFINED_WINE_VERSIONS.length });
    return [...PREDEFINED_WINE_VERSIONS];
  }

  async installWine(
    request: InstallRequest,
    sender?: WebContents,
  ): Promise<void> {
    this.logger.info("install started", request);
    this.sendStatus(sender, {
      versionId: request.versionId,
      status: "installing",
      progress: 1,
      message: `${request.versionId} install started.`,
    });

    this.sendStatus(sender, {
      versionId: request.versionId,
      status: "completed",
      progress: 100,
      message: `${request.versionId} install completed.`,
    });
    this.logger.info("install completed", { versionId: request.versionId });
  }

  private sendStatus(
    sender: WebContents | undefined,
    payload: WineStatusPayload,
  ): void {
    sender?.send(IPC_CHANNELS.WINE.STATUS_UPDATE.channelName, payload);
  }
}

export const wineManager = new WineManager();
