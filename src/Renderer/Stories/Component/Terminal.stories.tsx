import type { Meta, StoryObj } from "@storybook/react";
import XTermTerminal from "../../Component/Terminal";

const meta: Meta<typeof XTermTerminal> = {
  title: "Component/Terminal",
  component: XTermTerminal,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    height: 420,
    welcomeMessage: "BDIH Storybook terminal",
  },
};

export default meta;
type Story = StoryObj<typeof XTermTerminal>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-dvh bg-[#0b1020] p-6">
      <XTermTerminal {...args} />
    </div>
  ),
};
