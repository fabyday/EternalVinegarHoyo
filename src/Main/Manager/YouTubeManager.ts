import {
  YouTubeLiveStatusPayload,
  YouTubeLiveStatusRequest,
} from "../../Common/Types/IPC";
import { logManager } from "./LogManager";

interface YouTubeSearchResponse {
  items?: unknown[];
  error?: {
    message?: string;
  };
}

interface ChannelIdCacheEntry {
  channelId: string;
  expiresAt: number;
}

interface LiveStatusCacheEntry {
  payload: YouTubeLiveStatusPayload;
  expiresAt: number;
}

export class YouTubeManager {
  private readonly logger = logManager.createLogger("YouTubeManager");
  private readonly channelIdCache = new Map<string, ChannelIdCacheEntry>();
  private readonly liveStatusCache = new Map<string, LiveStatusCacheEntry>();

  async getLiveStatus(
    request: YouTubeLiveStatusRequest = {},
  ): Promise<YouTubeLiveStatusPayload> {
    try {
      const channelId = await this.resolveChannelId(request);

      if (!channelId) {
        return this.createPayload(false, undefined, "YouTube channel ID could not be resolved.");
      }

      const cached = this.getCachedLiveStatus(channelId);
      if (cached) {
        return cached;
      }

      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        return this.createPayload(false, channelId, "YOUTUBE_API_KEY is not set.");
      }

      const isLive = await this.fetchLiveStatus(channelId, apiKey);
      const payload = this.createPayload(isLive, channelId);
      this.liveStatusCache.set(channelId, {
        payload,
        expiresAt: Date.now() + 60_000,
      });

      return payload;
    } catch (error) {
      const message = this.describeError(error);
      this.logger.warn("Live status check failed.", message);
      return this.createPayload(false, request.channelId, message);
    }
  }

  private async resolveChannelId(
    request: YouTubeLiveStatusRequest,
  ): Promise<string | undefined> {
    if (request.channelId) {
      return request.channelId;
    }

    if (!request.handle) {
      return undefined;
    }

    return this.getChannelIdFromHandle(request.handle);
  }

  private async getChannelIdFromHandle(handle: string): Promise<string | undefined> {
    const normalizedHandle = handle.startsWith("@") ? handle : `@${handle}`;
    const cached = this.channelIdCache.get(normalizedHandle);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.channelId;
    }

    const response = await fetch(`https://www.youtube.com/${normalizedHandle}`, {
      headers: {
        "user-agent": "BDIH-Launcher/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`YouTube channel page failed: ${response.status}`);
    }

    const html = await response.text();
    const match = html.match(/"channelId":"(UC[^"]+)"/);
    const channelId = match?.[1];

    if (channelId) {
      this.channelIdCache.set(normalizedHandle, {
        channelId,
        expiresAt: Date.now() + 24 * 60 * 60_000,
      });
    }

    return channelId;
  }

  private async fetchLiveStatus(channelId: string, apiKey: string): Promise<boolean> {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("eventType", "live");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "1");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url);
    const data = (await response.json()) as YouTubeSearchResponse;

    if (!response.ok) {
      throw new Error(data.error?.message ?? `YouTube API failed: ${response.status}`);
    }

    return Array.isArray(data.items) && data.items.length > 0;
  }

  private getCachedLiveStatus(
    channelId: string,
  ): YouTubeLiveStatusPayload | undefined {
    const cached = this.liveStatusCache.get(channelId);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.payload;
    }

    return undefined;
  }

  private createPayload(
    isLive: boolean,
    channelId?: string,
    error?: string,
  ): YouTubeLiveStatusPayload {
    return {
      isLive,
      channelId,
      checkedAt: new Date().toISOString(),
      error,
    };
  }

  private describeError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}

export const youtubeManager = new YouTubeManager();
