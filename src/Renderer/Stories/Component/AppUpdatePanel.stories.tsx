import type { Meta, StoryObj } from "@storybook/react";
import { AppUpdatePanel } from "../../Component/AppUpdatePanel";

const meta: Meta<typeof AppUpdatePanel> = {
  title: "Component/AppUpdatePanel",
  component: AppUpdatePanel,
  parameters: {
    layout: "centered",
  },
  args: {
    autoUpdateEnabled: true,
    onAutoUpdateChange: () => undefined,
    onCheckForUpdates: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof AppUpdatePanel>;

export const Idle: Story = {
  render: (args) => (
    <div className="w-[720px] bg-[#0b1020] p-8 text-slate-100">
      <AppUpdatePanel {...args} />
    </div>
  ),
};

export const Downloading: Story = {
  args: {
    status: {
      status: "downloading",
      message: "Downloading update.",
      progress: 48,
    },
  },
  render: (args) => (
    <div className="w-[720px] bg-[#0b1020] p-8 text-slate-100">
      <AppUpdatePanel {...args} />
    </div>
  ),
};

export const UpdateAvailable: Story = {
  args: {
    status: {
      status: "available",
      message: "Update is available.",
      version: "1.1.0",
    },
  },
  render: (args) => (
    <div className="w-[720px] bg-[#0b1020] p-8 text-slate-100">
      <AppUpdatePanel {...args} />
    </div>
  ),
};

export const Error: Story = {
  args: {
    autoUpdateEnabled: false,
    status: {
      status: "error",
      message: "Update check failed.",
      error: "Failed to resolve update feed.",
    },
  },
  render: (args) => (
    <div className="w-[720px] bg-[#0b1020] p-8 text-slate-100">
      <AppUpdatePanel {...args} />
    </div>
  ),
};
