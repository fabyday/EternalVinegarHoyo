import type { Meta, StoryObj } from "@storybook/react";
import { ImageButton } from "../../Component/ImageButton";

const meta: Meta<typeof ImageButton> = {
  title: "Component/ImageButton",
  component: ImageButton,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ImageButton>;

export const Default: Story = {
  args: {
    name: "Genshin Impact",
    subtitle: "GE-Proton Latest",
  },
};
