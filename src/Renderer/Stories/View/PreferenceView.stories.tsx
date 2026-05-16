import type { Meta, StoryObj } from "@storybook/react";
import { DeveloperYouTubeLink, PreferenceView } from "../../View/PreferenceView/PreferenceView";

const meta: Meta<typeof PreferenceView> = {
  title: "View/PreferenceView",
  component: PreferenceView,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    installPath: "~/Library/Application Support/BDIH/Wine",
    accentColor: "rose",
    autoUpdateEnabled: true,
    developerSiteUrl: "https://molera.dev",
    developerGitHubUrl: "https://github.com/molera1708",
    developerYouTubeUrl: "https://www.youtube.com/@molera1708/videos",
    onInstallPathChange: () => undefined,
    onLocaleChange: () => undefined,
    onAccentColorChange: () => undefined,
    onAutoUpdateEnabledChange: () => undefined,
    onCheckForUpdates: () => undefined,
    onReset: () => undefined,
    onSave: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof PreferenceView>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-dvh bg-[#0b1020] text-slate-100">
      <PreferenceView {...args} />
    </div>
  ),
};

export const WineSettings: Story = {
  args: {
    initialCategory: "wine",
    initialHasChanges: true,
  },
  render: (args) => (
    <div className="min-h-dvh bg-[#0b1020] text-slate-100">
      <PreferenceView {...args} />
    </div>
  ),
};

export const ShortcutSettings: Story = {
  args: {
    initialCategory: "shortcut",
  },
  render: (args) => (
    <div className="min-h-dvh bg-[#0b1020] text-slate-100">
      <PreferenceView {...args} />
    </div>
  ),
};

export const DeveloperOnAir: Story = {
  args: {
    isDeveloperOnAir: true,
  },
  render: (args) => (
    <div className="min-h-dvh bg-[#0b1020] text-slate-100">
      <PreferenceView {...args} />
    </div>
  ),
};

export const GeneralWithUpdateDownloading: Story = {
  args: {
    appUpdateStatus: {
      status: "downloading",
      message: "Downloading update.",
      progress: 62,
      version: "1.1.0",
    },
  },
  render: (args) => (
    <div className="min-h-dvh bg-[#0b1020] text-slate-100">
      <PreferenceView {...args} />
    </div>
  ),
};

export const DeveloperYouTubeBadgeStates: Story = {
  parameters: {
    layout: "centered",
  },
  render: () => (
    <div className="min-h-dvh w-dvw bg-[#0b1020] p-10 text-slate-100">
      <div className="mx-auto grid max-w-2xl gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase text-slate-500">OFFLINE</p>
          <DeveloperYouTubeLink url="https://www.youtube.com/@molera1708/videos" isOnAir={false} />
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase text-red-300">ON AIR Glow</p>
          <DeveloperYouTubeLink url="https://www.youtube.com/@molera1708/videos" isOnAir />
        </div>
      </div>
    </div>
  ),
};
