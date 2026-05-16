import type { Meta, StoryObj } from "@storybook/react";
import { WineVersion } from "../../../Common/Types/Wine";
import { WineVersionCard } from "../../Component/WineVersionCard";

const mockVersion: WineVersion = {
  id: "wine-9.0-stable",
  name: "Wine 9.0 Stable",
  version: "9.0",
  type: "official",
  status: "available",
  progress: 0,
};

const meta: Meta<typeof WineVersionCard> = {
  title: "Component/WineVersionCard",
  component: WineVersionCard,
  parameters: {
    layout: "centered",
  },
  args: {
    version: mockVersion,
    installPath: "~/Library/Application Support/BDIH/Wine",
    isSelected: false,
    onSelect: () => undefined,
    onInstall: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof WineVersionCard>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[28rem] bg-[#0b1020] p-6">
      <WineVersionCard {...args} />
    </div>
  ),
};

export const Installing: Story = {
  args: {
    version: {
      ...mockVersion,
      status: "installing",
      progress: 42,
    },
    isSelected: true,
  },
  render: Default.render,
};
