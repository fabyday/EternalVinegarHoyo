import React from "react";
import { createRoot } from "react-dom/client";
import "../../style/index.css";
import { AppUpdateStatusPayload, IPC_CHANNELS, LauncherPreferencePayload, YouTubeLiveStatusPayload } from "../../../Common/Types/IPC";
import { change_renderer_locale, resolve_initial_locale, SupportedLocale } from "../../I18n";
import { AccentColor, apply_renderer_accent_color, resolve_initial_accent_color } from "../../Theme";
import { PreferenceView } from "./PreferenceView";

const DEVELOPER_YOUTUBE_HANDLE = "@molera1708";
const DEVELOPER_SITE_URL = "https://molera.dev";
const DEVELOPER_GITHUB_URL = "https://github.com/molera1708";
const DEVELOPER_YOUTUBE_URL = `https://www.youtube.com/${DEVELOPER_YOUTUBE_HANDLE}/videos`;

const App: React.FC = () => {
  const [locale, setLocale] = React.useState<SupportedLocale>(() => resolve_initial_locale());
  const [accentColor, setAccentColor] = React.useState<AccentColor>(() => resolve_initial_accent_color());
  const [isDeveloperOnAir, setIsDeveloperOnAir] = React.useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = React.useState(true);
  const [appUpdateStatus, setAppUpdateStatus] = React.useState<AppUpdateStatusPayload>();

  React.useEffect(() => {
    apply_renderer_accent_color(accentColor);
  }, [accentColor]);

  React.useEffect(() => {
    let isMounted = true;

    async function load_preference() {
      try {
        const preference = (await window.BTIH_API?.invoke(
          IPC_CHANNELS.APP.GET_PREFERENCE.channelName,
          undefined as never,
        )) as LauncherPreferencePayload | undefined;

        if (isMounted && preference) {
          setAutoUpdateEnabled(preference.autoCheckUpdates);
        }
      } catch {
        if (isMounted) {
          setAutoUpdateEnabled(true);
        }
      }
    }

    void load_preference();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    return window.BTIH_API?.on(IPC_CHANNELS.APP.UPDATE_STATUS.channelName, (_event, payload) => {
      setAppUpdateStatus(payload);
    });
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    async function refresh_developer_live_status() {
      try {
        const status = (await window.BTIH_API?.invoke(
          IPC_CHANNELS.YOUTUBE.GET_LIVE_STATUS.channelName,
          { handle: DEVELOPER_YOUTUBE_HANDLE },
        )) as YouTubeLiveStatusPayload | undefined;

        if (isMounted) {
          setIsDeveloperOnAir(status?.isLive ?? false);
        }
      } catch {
        if (isMounted) {
          setIsDeveloperOnAir(false);
        }
      }
    }

    void refresh_developer_live_status();
    const intervalId = window.setInterval(refresh_developer_live_status, 60_000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handle_locale_change = (nextLocale: SupportedLocale) => {
    setLocale(nextLocale);
    void change_renderer_locale(nextLocale);
  };

  const handle_auto_update_change = (enabled: boolean) => {
    setAutoUpdateEnabled(enabled);
    void window.BTIH_API?.invoke(IPC_CHANNELS.APP.UPDATE_PREFERENCE.channelName, {
      autoCheckUpdates: enabled,
    });
  };

  const handle_check_for_updates = () => {
    window.BTIH_API?.send(IPC_CHANNELS.APP.UPDATE.channelName, undefined as never);
  };

  return (
    <div className="min-h-dvh bg-[#0b1020] text-slate-100">
      <PreferenceView
        locale={locale}
        accentColor={accentColor}
        autoUpdateEnabled={autoUpdateEnabled}
        appUpdateStatus={appUpdateStatus}
        developerSiteUrl={DEVELOPER_SITE_URL}
        developerGitHubUrl={DEVELOPER_GITHUB_URL}
        developerYouTubeUrl={DEVELOPER_YOUTUBE_URL}
        isDeveloperOnAir={isDeveloperOnAir}
        onLocaleChange={handle_locale_change}
        onAccentColorChange={setAccentColor}
        onAutoUpdateEnabledChange={handle_auto_update_change}
        onCheckForUpdates={handle_check_for_updates}
      />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
