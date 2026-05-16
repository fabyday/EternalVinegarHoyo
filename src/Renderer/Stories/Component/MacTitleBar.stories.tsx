import type { Meta, StoryObj } from "@storybook/react";
import { MacTitleBar } from "../../Component/MacTitleBar";

const meta: Meta<typeof MacTitleBar> = {
  title: "Component/MacTitleBar",
  component: MacTitleBar,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    title: "밥똥이리호요",
    onQuit: () => undefined,
    onMinimize: () => undefined,
    onMaximize: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof MacTitleBar>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-32 bg-[#0b1020] text-slate-100">
      <MacTitleBar {...args} />
    </div>
  ),
};
