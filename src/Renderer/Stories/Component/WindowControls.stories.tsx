import type { Meta, StoryObj } from "@storybook/react";
import { WindowControls } from "../../Component/WindowControls";

const meta: Meta<typeof WindowControls> = {
  title: "Component/WindowControls",
  component: WindowControls,
  parameters: {
    layout: "centered",
  },
  args: {
    onRefresh: () => undefined,
    onQuit: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof WindowControls>;

export const Default: Story = {
  render: (args) => (
    <div className="rounded-xl bg-[#0f172a] p-8">
      <WindowControls {...args} />
    </div>
  ),
};

export const QuitOnly: Story = {
  args: {
    onRefresh: undefined,
  },
  render: Default.render,
};
