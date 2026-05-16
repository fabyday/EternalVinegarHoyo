import { downloadByCurl } from "../Program/Curl";

type CurlArgs = Parameters<typeof downloadByCurl>[1];
type CurlReturn = ReturnType<typeof downloadByCurl>;

export interface DownloadCallbacks {
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  onEnd?: (success: boolean) => void;
}

export class DownloadManager {
  private readonly downloads = new Map<string, CurlReturn>();

  startDownload(
    id: string,
    url: string,
    args: CurlArgs,
    callbacks: DownloadCallbacks = {},
  ): string {
    if (this.downloads.has(id)) {
      throw new Error(`Download already exists: ${id}`);
    }

    const download = downloadByCurl(url, args, {
      onStart: () => callbacks.onStart?.(),
      onProgress: (progress) => callbacks.onProgress?.(progress),
      onError: (error) => {
        this.downloads.delete(id);
        callbacks.onError?.(error);
      },
      onEnd: (success) => {
        this.downloads.delete(id);
        callbacks.onEnd?.(success);
      },
    });

    this.downloads.set(id, download);
    return id;
  }

  async stopDownload(id: string): Promise<void> {
    const download = this.downloads.get(id);

    if (!download) {
      return;
    }

    await download.StopCurl();
    this.downloads.delete(id);
  }

  listActiveDownloadIds(): string[] {
    return [...this.downloads.keys()];
  }
}

export const downloadManager = new DownloadManager();
