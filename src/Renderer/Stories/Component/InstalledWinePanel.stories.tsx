import type { Meta, StoryObj } from "@storybook/react";
import { PREDEFINED_WINE_VERSIONS } from "../../../Common/Constant/WineCatalog";
import { InstalledWinePanel } from "../../Component/InstalledWinePanel";

const wineVersions = PREDEFINED_WINE_VERSIONS.map((version, index) =>
  index === 0
    ? {
        ...version,
        status: "installed" as const,
        progress: 100,
        path: "~/Library/Application Support/BDIH/Wine/wine-9.0-stable",
      }
    : index === 1
      ? {
          ...version,
          status: "installing" as const,
          progress: 42,
        }
      : version,
);

const meta: Meta<typeof InstalledWinePanel> = {
  title: "Component/InstalledWinePanel",
  component: InstalledWinePanel,
  parameters: {
    layout: "centered",
  },
  args: {
    wineVersions,
    selectedWineVersionId: wineVersions[0].id,
    installPath: "~/Library/Application Support/BDIH/Wine",
    onSelectWineVersion: () => undefined,
    onClose: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof InstalledWinePanel>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[28rem] bg-[#0b1020] p-4 text-slate-100">
      <InstalledWinePanel {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    wineVersions: PREDEFINED_WINE_VERSIONS,
  },
  render: Default.render,
};
